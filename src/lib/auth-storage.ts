/**
 * Persists Google auth to localStorage. Uses refresh token to get new access tokens
 * when they expire, so the user stays logged in indefinitely until they sign out.
 */

const AUTH_KEY = 'fivwall_google_auth';

export interface StoredAuth {
    accessToken: string;
    refreshToken: string | null;
    expiresAt: number;
    email: string | null;
    name: string | null;
    picture: string | null;
}

export function saveAuth(auth: StoredAuth): void {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
    } catch {
        // Ignore quota or privacy errors
    }
}

export function loadAuth(): StoredAuth | null {
    if (typeof window === 'undefined') return null;
    try {
        const raw = localStorage.getItem(AUTH_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as unknown;
        if (
            parsed &&
            typeof parsed === 'object' &&
            typeof (parsed as StoredAuth).accessToken === 'string'
        ) {
            const auth = parsed as StoredAuth;
            return {
                ...auth,
                refreshToken: auth.refreshToken ?? null,
                expiresAt: auth.expiresAt ?? 0,
            };
        }
    } catch {
        // Invalid or corrupted
    }
    return null;
}

export function clearAuth(): void {
    if (typeof window === 'undefined') return;
    try {
        localStorage.removeItem(AUTH_KEY);
    } catch {
        // Ignore
    }
}
