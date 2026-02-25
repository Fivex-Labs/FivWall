/**
 * Google Drive API client for FivWall sync.
 * Uses OAuth 2.0 token model (no backend required).
 * Scope: drive.file - only app-created files are accessible.
 */

const DRIVE_API_BASE = 'https://www.googleapis.com/drive/v3';
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

async function driveFetch(
    url: string,
    options: RequestInit = {}
): Promise<Response> {
    if (!accessToken) {
        throw new Error('Not authenticated');
    }
    const headers: HeadersInit = {
        Authorization: `Bearer ${accessToken}`,
        ...(options.headers as Record<string, string>),
    };
    return fetch(url, { ...options, headers });
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

/**
 * Upload data to Google Drive.
 */
export async function uploadData(payload: {
    version: number;
    timestamp: number;
    notes: unknown[];
    recentSearches: string[];
}): Promise<void> {
    const folderId = await getOrCreateFivWallFolder();
    const fileId = await findDataFile(folderId);
    const body = JSON.stringify(payload);

    if (fileId) {
        // Update existing file
        const updateUrl = `${DRIVE_UPLOAD_BASE}/files/${fileId}?uploadType=media`;
        const res = await driveFetch(updateUrl, {
            method: 'PATCH',
            headers: { 'Content-Type': MIME_JSON },
            body,
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error?.message || `Upload failed: ${res.status}`);
        }
    } else {
        // Create new file via multipart upload
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
            throw new Error(err.error?.message || `Create file failed: ${createRes.status}`);
        }
    }
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
