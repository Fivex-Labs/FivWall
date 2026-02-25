/**
 * Sync service: pushes local state to Google Drive and pulls remote changes.
 * Subscribes to Zustand store, debounces pushes, merges on pull.
 */

import { useNoteStore } from '@/store/useNoteStore';
import { useSyncStore } from '@/store/useSyncStore';
import {
    prepareUploadContext,
    executeUpload,
    UploadWriteError,
    downloadData,
    isAuthenticated,
    setAccessToken,
    revokeAccess,
} from './google-drive';
import { saveAuth, loadAuth, clearAuth } from './auth-storage';

const DEBOUNCE_MS = 2500;

let debounceTimer: ReturnType<typeof setTimeout> | null = null;
let lastPushedState: string | null = null;

function getSerializedState(): string {
    const state = useNoteStore.getState();
    return JSON.stringify({
        notes: state.notes,
        recentSearches: state.recentSearches,
    });
}

function getPayload() {
    const state = useNoteStore.getState();
    return {
        version: 1,
        timestamp: Date.now(),
        notes: state.notes,
        recentSearches: state.recentSearches,
    };
}

const RETRY_DELAY_MS = 2000;
const MAX_RETRIES = 2;

async function push(retryCount = 0): Promise<void> {
    if (!isAuthenticated()) return;

    const serialized = getSerializedState();
    if (serialized === lastPushedState) return;

    useSyncStore.getState().setSyncStatus('syncing');
    useSyncStore.getState().setError(null);

    try {
        const payload = getPayload();
        const { folderId, fileId } = await prepareUploadContext();
        await executeUpload(folderId, fileId, payload);
        lastPushedState = serialized;
        useSyncStore.getState().setSyncStatus('synced');
        useSyncStore.getState().setLastSyncedAt(Date.now());
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Sync failed';
        // Don't retry on auth errors (401) - user needs to sign in again
        if (message.includes('Session expired') || message.includes('sign in again')) {
            useSyncStore.getState().setError(message);
            return;
        }
        // Only show "Sync failed" when the PATCH (actual write) has failed.
        // GET/prepare failures: retry without showing error.
        const isWriteFailure = err instanceof UploadWriteError;
        if (retryCount < MAX_RETRIES) {
            await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
            return push(retryCount + 1);
        }
        if (isWriteFailure) {
            useSyncStore.getState().setError(message);
        }
        // For prepare failures after retries: don't set error, stay in syncing (will retry on next change)
    }
}

function schedulePush(): void {
    // Clear any previous error and show syncing as soon as user makes a change
    useSyncStore.getState().setSyncStatus('syncing');
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        debounceTimer = null;
        void push();
    }, DEBOUNCE_MS);
}

async function pull(): Promise<void> {
    if (!isAuthenticated()) return;

    useSyncStore.getState().setSyncStatus('syncing');

    try {
        const remote = await downloadData();
        if (!remote) {
            useSyncStore.getState().setSyncStatus('idle');
            return;
        }

        const local = useNoteStore.getState();
        const localTimestamp = useSyncStore.getState().lastSyncedAt ?? 0;
        const remoteTimestamp = remote.timestamp ?? 0;

        // Last-write-wins at payload level
        if (remoteTimestamp >= localTimestamp) {
            useNoteStore.getState().importData(remote, 'replace');
            lastPushedState = JSON.stringify({ notes: remote.notes, recentSearches: remote.recentSearches });
        }
        // If local is newer, we'll push on next change

        useSyncStore.getState().setSyncStatus('synced');
        useSyncStore.getState().setLastSyncedAt(Date.now());
    } catch {
        useSyncStore.getState().setSyncStatus('idle');
    }
}

export function initSyncService(): () => void {
    const unsubscribe = useNoteStore.subscribe(() => {
        if (isAuthenticated()) {
            schedulePush();
        }
    });

    return () => {
        unsubscribe();
        if (debounceTimer) {
            clearTimeout(debounceTimer);
            debounceTimer = null;
        }
    };
}

export async function triggerPull(): Promise<void> {
    await pull();
}

export async function triggerPush(): Promise<void> {
    await push();
}

export function handleLoginSuccess(
    accessToken: string,
    email?: string | null,
    name?: string | null,
    picture?: string | null,
    refreshToken?: string | null,
    expiresIn?: number
): void {
    setAccessToken(accessToken);
    useSyncStore.getState().login(email, name, picture);
    const expiresAt = expiresIn ? Date.now() + expiresIn * 1000 : 0;
    saveAuth({
        accessToken,
        refreshToken: refreshToken ?? null,
        expiresAt,
        email: email ?? null,
        name: name ?? null,
        picture: picture ?? null,
    });
    lastPushedState = null;

    void (async () => {
        const localNotes = useNoteStore.getState().notes.length;
        const remote = await downloadData();
        const hasRemote = remote && remote.notes.length > 0;
        const hasLocal = localNotes > 0;

        if (hasLocal && hasRemote) {
            useSyncStore.getState().setFirstTimeSyncDialog({
                localCount: localNotes,
                remoteCount: remote!.notes.length,
                remoteData: remote!,
            });
            return;
        }

        if (hasRemote) {
            await pull();
            return;
        }

        if (hasLocal) {
            await push();
            return;
        }

        useSyncStore.getState().setSyncStatus('idle');
    })();
}

export function resolveFirstTimeSyncChoice(choice: 'push' | 'pull'): void {
    const dialog = useSyncStore.getState().firstTimeSyncDialog;
    if (!dialog) return;

    useSyncStore.getState().setFirstTimeSyncDialog(null);

    if (choice === 'push') {
        void push();
    } else {
        useNoteStore.getState().importData(dialog.remoteData, 'replace');
        lastPushedState = JSON.stringify({
            notes: dialog.remoteData.notes,
            recentSearches: dialog.remoteData.recentSearches,
        });
        useSyncStore.getState().setSyncStatus('synced');
        useSyncStore.getState().setLastSyncedAt(Date.now());
    }
}

export async function handleLogout(): Promise<void> {
    await revokeAccess();
    clearAuth();
    useSyncStore.getState().logout();
    lastPushedState = null;
}

/**
 * Restore session from localStorage. Called on app load.
 * Does NOT run first-time sync dialog - only restores state and pulls.
 */
export function restoreSession(): void {
    const stored = loadAuth();
    if (!stored?.accessToken) return;

    setAccessToken(stored.accessToken);
    useSyncStore.getState().login(stored.email, stored.name, stored.picture);
    // expiresAt and refreshToken used by google-drive for token refresh

    if (isAuthenticated()) {
        void (async () => {
            try {
                await pull();
            } catch {
                // Token may be expired; 401 handled in driveFetch
            }
        })();
    }
}
