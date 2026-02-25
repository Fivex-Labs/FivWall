"use client";

import * as React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { LogOut } from "lucide-react";
import { useSyncStore } from "@/store/useSyncStore";
import { handleLoginSuccess, handleLogout } from "@/lib/sync-service";
import { cn } from "@/lib/utils";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

const DRIVE_SCOPE = "https://www.googleapis.com/auth/drive.file";
const EMAIL_SCOPE = "https://www.googleapis.com/auth/userinfo.email";
const PROFILE_SCOPE = "https://www.googleapis.com/auth/userinfo.profile";

// Google "G" logo SVG (official brand colors)
function GoogleLogo({ className }: { className?: string }) {
    return (
        <svg className={cn("w-5 h-5", className)} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
            />
            <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
            />
            <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
            />
            <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
            />
        </svg>
    );
}

export function GoogleAuthButton({
    className,
    isSidebarCollapsed,
}: {
    className?: string;
    isSidebarCollapsed?: boolean;
}) {
    const { isLoggedIn, userEmail, userName, userPicture } = useSyncStore();
    const [isLoading, setIsLoading] = React.useState(false);
    const [popoverOpen, setPopoverOpen] = React.useState(false);
    const [imgError, setImgError] = React.useState(false);

    const login = useGoogleLogin({
        flow: "implicit",
        scope: `${DRIVE_SCOPE} ${EMAIL_SCOPE} ${PROFILE_SCOPE}`,
        onSuccess: async (tokenResponse) => {
            setIsLoading(true);
            try {
                let email: string | null = null;
                let name: string | null = null;
                let picture: string | null = null;
                if (tokenResponse.access_token) {
                    try {
                        const res = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
                            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                        });
                        if (res.ok) {
                            const data = await res.json();
                            email = data.email ?? null;
                            name = data.name ?? null;
                            picture = data.picture ?? null;
                        }
                    } catch {
                        // Ignore
                    }
                    handleLoginSuccess(tokenResponse.access_token, email, name, picture);
                }
            } finally {
                setIsLoading(false);
            }
        },
        onError: () => {
            setIsLoading(false);
        },
    });

    const handleLogoutClick = async () => {
        setPopoverOpen(false);
        setIsLoading(true);
        try {
            await handleLogout();
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoggedIn) {
        return (
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger asChild>
                    <button
                        type="button"
                        className={cn(
                            "w-full flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                            isSidebarCollapsed && "justify-center px-2",
                            className
                        )}
                        title={userEmail ?? "Account"}
                    >
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 overflow-hidden">
                            {userPicture && !imgError ? (
                                <img
                                    src={userPicture}
                                    alt=""
                                    className="w-full h-full object-cover"
                                    onError={() => setImgError(true)}
                                />
                            ) : (
                                <span className="text-sm font-medium text-primary">
                                    {(userName ?? userEmail ?? "?")[0]?.toUpperCase()}
                                </span>
                            )}
                        </div>
                        {!isSidebarCollapsed && (
                            <div className="flex-1 min-w-0 text-left">
                                <p className="text-sm font-medium truncate">
                                    {userName ?? "Signed in"}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                    {userEmail}
                                </p>
                            </div>
                        )}
                    </button>
                </PopoverTrigger>
                <PopoverContent align="start" side="right" className="w-64 p-2">
                    <div className="px-3 py-2 border-b border-border mb-2">
                        <p className="text-sm font-medium truncate">{userName ?? "Signed in"}</p>
                        <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLogoutClick}
                        disabled={isLoading}
                        className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                        <LogOut className="w-4 h-4 shrink-0" />
                        Sign out
                    </Button>
                </PopoverContent>
            </Popover>
        );
    }

    return (
        <button
            type="button"
            onClick={() => login()}
            disabled={isLoading}
            className={cn(
                "w-full flex items-center justify-center gap-2.5 h-10 rounded-lg border border-[#dadce0] bg-white text-[#3c4043] font-medium text-sm transition-colors hover:bg-[#f8f9fa] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
                "dark:border-gray-600 dark:bg-white dark:text-[#3c4043] dark:hover:bg-gray-50",
                isSidebarCollapsed && "px-2",
                className
            )}
            title="Login with Google to sync to Drive"
        >
            {isLoading ? (
                <span className="animate-pulse">Signing in...</span>
            ) : (
                <>
                    <GoogleLogo />
                    {!isSidebarCollapsed && (
                        <span>Sign in with Google</span>
                    )}
                </>
            )}
        </button>
    );
}
