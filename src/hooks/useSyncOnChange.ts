"use client";

import { useEffect } from 'react';
import { initSyncService, triggerPull } from '@/lib/sync-service';
import { isAuthenticated } from '@/lib/google-drive';

/**
 * Initializes the sync service when the user is logged in.
 * Subscribes to the note store and debounces pushes to Google Drive.
 * Pulls on tab focus when online.
 */
export function useSyncOnChange() {
    useEffect(() => {
        const cleanup = initSyncService();

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && isAuthenticated() && navigator.onLine) {
                void triggerPull();
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            cleanup();
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);
}
