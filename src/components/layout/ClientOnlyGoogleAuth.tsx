"use client";

import * as React from "react";
import { GoogleAuthButton } from "./GoogleAuthButton";

const hasGoogleClientId = !!(
    typeof process !== "undefined" &&
    process.env?.NEXT_PUBLIC_GOOGLE_CLIENT_ID
);

/**
 * Wraps GoogleAuthButton to only render on the client.
 * Fixes Vercel prerender error: "Google OAuth components must be used within GoogleOAuthProvider"
 * - useGoogleLogin from @react-oauth/google does not support SSR
 * - Only render after mount to avoid running during prerender
 * - Only render when clientId is configured (otherwise provider is not present)
 */
export function ClientOnlyGoogleAuth({
    isSidebarCollapsed,
    className,
}: {
    isSidebarCollapsed: boolean;
    className?: string;
}) {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!hasGoogleClientId) return null;

    if (!mounted) {
        return <div className={className} style={{ minHeight: 40 }} aria-hidden />;
    }

    return (
        <GoogleAuthButton
            isSidebarCollapsed={isSidebarCollapsed}
            className={className}
        />
    );
}
