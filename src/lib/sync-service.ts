/**
 * Sync service: pushes local state to Google Drive and pulls remote changes.
 * Subscribes to Zustand store, debounces pushes, merges on pull.
 */

import { useNoteStore } from '@/store/useNoteStore';
import { useSyncStore } from '@/store/useSyncStore';
import {
    uploadData,
    downloadData,
    isAuthenticated,
    setAccessToken,
    revokeAccess,
} from './google-drive';

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

const RETRY_DELAY_MS = 1500;

async function push(retryCount = 0): Promise<void> {
    if (!isAuthenticated()) return;

    const serialized = getSerializedState();
    if (serialized === lastPushedState) return;

    useSyncStore.getState().setSyncStatus('syncing');
    useSyncStore.getState().setError(null);

    try {
        const payload = getPayload();
        await uploadData(payload);
        lastPushedState = serialized;
        useSyncStore.getState().setSyncStatus('synced');
        useSyncStore.getState().setLastSyncedAt(Date.now());
    } catch (err) {
        if (retryCount < 1) {
            await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
            return push(retryCount + 1);
        }
        const message = err instanceof Error ? err.message : 'Sync failed';
        useSyncStore.getState().setError(message);
    }
}

function schedulePush(): void {
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
    picture?: string | null
): void {
    setAccessToken(accessToken);
    useSyncStore.getState().login(email, name, picture);
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
    useSyncStore.getState().logout();
    lastPushedState = null;
}
