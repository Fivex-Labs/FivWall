/**
 * Google Drive API client for FivWall sync.
 * Uses OAuth 2.0 with refresh tokens for persistent sessions.
 * Scope: drive.file - only app-created files are accessible.
 */

import { useSyncStore } from '@/store/useSyncStore';
import { loadAuth, saveAuth, clearAuth } from './auth-storage';

const DRIVE_API_BASE = 'https://www.googleapis.com/drive/v3';
const REFRESH_BUFFER_MS = 5 * 60 * 1000; // Refresh 5 min before expiry
const DRIVE_UPLOAD_BASE = 'https://www.googleapis.com/upload/drive/v3';
const FIVWALL_FOLDER_NAME = 'FivWall';
const DATA_FILE_NAME = 'fivwall-data.json';
const MIME_JSON = 'application/json';

export interface DriveFile {
    id: string;
    name: string;
    mimeType: string;
}

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
    accessToken = token;
}

export function getAccessToken(): string | null {
    return accessToken;
}

export function isAuthenticated(): boolean {
    return !!accessToken;
}

async function refreshAccessToken(): Promise<boolean> {
    const stored = loadAuth();
    if (!stored?.refreshToken) return false;

    try {
        const res = await fetch('/api/auth/google/refresh', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh_token: stored.refreshToken }),
        });
        const data = (await res.json()) as {
            access_token?: string;
            expires_in?: number;
            error?: string;
        };
        if (!res.ok || !data.access_token) return false;

        const expiresIn = data.expires_in ?? 3600;
        accessToken = data.access_token;
        saveAuth({
            ...stored,
            accessToken: data.access_token,
            expiresAt: Date.now() + expiresIn * 1000,
        });
        return true;
    } catch {
        return false;
    }
}

async function ensureValidToken(): Promise<void> {
    if (!accessToken) throw new Error('Not authenticated');

    const stored = loadAuth();
    if (!stored?.refreshToken) return;

    const now = Date.now();
    if (stored.expiresAt > now + REFRESH_BUFFER_MS) return;

    const ok = await refreshAccessToken();
    if (!ok) {
        accessToken = null;
        clearAuth();
        useSyncStore.getState().logout();
        throw new Error('Session expired. Please sign in again.');
    }
}

async function driveFetch(
    url: string,
    options: RequestInit = {},
    retried = false
): Promise<Response> {
    await ensureValidToken();
    if (!accessToken) throw new Error('Not authenticated');

    const headers: HeadersInit = {
        Authorization: `Bearer ${accessToken}`,
        ...(options.headers as Record<string, string>),
    };
    const res = await fetch(url, { ...options, headers });

    if (res.status === 401 && !retried) {
        const ok = await refreshAccessToken();
        if (ok) return driveFetch(url, options, true);
        accessToken = null;
        clearAuth();
        useSyncStore.getState().logout();
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || 'Session expired. Please sign in again.');
    }

    return res;
}

/**
 * Find or create the FivWall folder in the user's Drive.
 */
export async function getOrCreateFivWallFolder(): Promise<string> {
    // Search for existing folder
    const searchUrl = new URL(`${DRIVE_API_BASE}/files`);
    searchUrl.searchParams.set('q', `name='${FIVWALL_FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder' and trashed=false`);
    searchUrl.searchParams.set('fields', 'files(id,name)');
    searchUrl.searchParams.set('spaces', 'drive');

    const res = await driveFetch(searchUrl.toString());
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || `Drive API error: ${res.status}`);
    } else {
        const data = await res.json();
        const files = data.files || [];
        if (files.length > 0) {
            return files[0].id;
        }
    }

    // Create folder
    const createRes = await driveFetch(`${DRIVE_API_BASE}/files`, {
        method: 'POST',
        headers: { 'Content-Type': MIME_JSON },
        body: JSON.stringify({
            name: FIVWALL_FOLDER_NAME,
            mimeType: 'application/vnd.google-apps.folder',
        }),
    });

    if (!createRes.ok) {
        const err = await createRes.json().catch(() => ({}));
        throw new Error(err.error?.message || `Failed to create folder: ${createRes.status}`);
    }

    const created = await createRes.json();
    return created.id;
}

/**
 * Find the data file in the FivWall folder.
 */
async function findDataFile(folderId: string): Promise<string | null> {
    const searchUrl = new URL(`${DRIVE_API_BASE}/files`);
    searchUrl.searchParams.set('q', `'${folderId}' in parents and name='${DATA_FILE_NAME}' and trashed=false`);
    searchUrl.searchParams.set('fields', 'files(id)');

    const res = await driveFetch(searchUrl.toString());
    if (!res.ok) return null;

    const data = await res.json();
    const files = data.files || [];
    return files.length > 0 ? files[0].id : null;
}

/** Thrown only when the PATCH/POST (actual write) fails. Used to distinguish from GET failures. */
export class UploadWriteError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'UploadWriteError';
    }
}

/**
 * Prepare upload context (folder + file IDs). GETs only - no write.
 */
export async function prepareUploadContext(): Promise<{ folderId: string; fileId: string | null }> {
    const folderId = await getOrCreateFivWallFolder();
    const fileId = await findDataFile(folderId);
    return { folderId, fileId };
}

/**
 * Execute the actual write (PATCH or POST). Only this phase can produce "Sync failed".
 */
export async function executeUpload(
    folderId: string,
    fileId: string | null,
    payload: { version: number; timestamp: number; notes: unknown[]; recentSearches: string[] }
): Promise<void> {
    const body = JSON.stringify(payload);

    if (fileId) {
        const updateUrl = `${DRIVE_UPLOAD_BASE}/files/${fileId}?uploadType=media`;
        const res = await driveFetch(updateUrl, {
            method: 'PATCH',
            headers: { 'Content-Type': MIME_JSON },
            body,
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new UploadWriteError(err.error?.message || `Upload failed: ${res.status}`);
        }
    } else {
        const boundary = 'fivwall_boundary_' + Date.now();
        const metadata = JSON.stringify({
            name: DATA_FILE_NAME,
            mimeType: MIME_JSON,
            parents: [folderId],
        });
        const multipartBody = [
            `--${boundary}`,
            'Content-Type: application/json; charset=UTF-8',
            '',
            metadata,
            `--${boundary}`,
            'Content-Type: application/json',
            '',
            body,
            `--${boundary}--`,
        ].join('\r\n');

        const createRes = await driveFetch(`${DRIVE_UPLOAD_BASE}/files?uploadType=multipart`, {
            method: 'POST',
            headers: { 'Content-Type': `multipart/related; boundary=${boundary}` },
            body: multipartBody,
        });

        if (!createRes.ok) {
            const err = await createRes.json().catch(() => ({}));
            throw new UploadWriteError(err.error?.message || `Create file failed: ${createRes.status}`);
        }
    }
}

/**
 * Upload data to Google Drive. Combines prepare + execute.
 */
export async function uploadData(payload: {
    version: number;
    timestamp: number;
    notes: unknown[];
    recentSearches: string[];
}): Promise<void> {
    const { folderId, fileId } = await prepareUploadContext();
    await executeUpload(folderId, fileId, payload);
}

/**
 * Download data from Google Drive.
 */
export async function downloadData(): Promise<{
    version: number;
    timestamp: number;
    notes: unknown[];
    recentSearches: string[];
} | null> {
    const folderId = await getOrCreateFivWallFolder();
    const fileId = await findDataFile(folderId);
    if (!fileId) return null;

    const res = await driveFetch(`${DRIVE_API_BASE}/files/${fileId}?alt=media`);
    if (!res.ok) return null;

    const data = await res.json();
    if (!Array.isArray(data.notes)) return null;

    return {
        version: data.version ?? 1,
        timestamp: data.timestamp ?? Date.now(),
        notes: data.notes,
        recentSearches: Array.isArray(data.recentSearches) ? data.recentSearches : [],
    };
}

/**
 * Revoke access (call Google's revoke endpoint).
 */
export async function revokeAccess(): Promise<void> {
    if (accessToken) {
        try {
            await fetch(`https://oauth2.googleapis.com/revoke?token=${accessToken}`, {
                method: 'POST',
            });
        } catch {
            // Ignore revoke errors
        }
        accessToken = null;
    }
}
