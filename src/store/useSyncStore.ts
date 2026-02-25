import { create } from 'zustand';

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error';

export interface FirstTimeSyncPayload {
    version: number;
    timestamp: number;
    notes: unknown[];
    recentSearches: string[];
}

export interface SyncStore {
    isLoggedIn: boolean;
    userEmail: string | null;
    userName: string | null;
    userPicture: string | null;
    syncStatus: SyncStatus;
    lastSyncedAt: number | null;
    error: string | null;
    firstTimeSyncDialog: { localCount: number; remoteCount: number; remoteData: FirstTimeSyncPayload } | null;
    setLoggedIn: (loggedIn: boolean, email?: string | null) => void;
    setSyncStatus: (status: SyncStatus) => void;
    setLastSyncedAt: (timestamp: number | null) => void;
    setError: (error: string | null) => void;
    setFirstTimeSyncDialog: (data: SyncStore['firstTimeSyncDialog']) => void;
    login: (email?: string | null, name?: string | null, picture?: string | null) => void;
    logout: () => void;
}

export const useSyncStore = create<SyncStore>((set) => ({
    isLoggedIn: false,
    userEmail: null,
    userName: null,
    userPicture: null,
    syncStatus: 'idle',
    lastSyncedAt: null,
    error: null,
    firstTimeSyncDialog: null,

    setLoggedIn: (loggedIn, email) =>
        set({
            isLoggedIn: loggedIn,
            userEmail: email ?? null,
            error: loggedIn ? null : undefined,
        }),

    setSyncStatus: (syncStatus) =>
        set({
            syncStatus,
            error: syncStatus === 'synced' || syncStatus === 'syncing' ? null : undefined,
        }),

    setLastSyncedAt: (lastSyncedAt) => set({ lastSyncedAt }),

    setError: (error) => set({ error, syncStatus: 'error' }),

    setFirstTimeSyncDialog: (firstTimeSyncDialog) => set({ firstTimeSyncDialog }),

    login: (email, name, picture) =>
        set({
            isLoggedIn: true,
            userEmail: email ?? null,
            userName: name ?? null,
            userPicture: picture ?? null,
            error: null,
        }),

    logout: () =>
        set({
            isLoggedIn: false,
            userEmail: null,
            userName: null,
            userPicture: null,
            syncStatus: 'idle',
            lastSyncedAt: null,
            error: null,
            firstTimeSyncDialog: null,
        }),
}));
