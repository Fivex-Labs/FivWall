"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Shield, Lock, HardDrive, Cloud, FileText, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SECTIONS = [
    { id: "intro", label: "Introduction" },
    { id: "data", label: "Data We Collect" },
    { id: "storage", label: "How We Store Data" },
    { id: "not-do", label: "What We Do NOT Do" },
    { id: "drive", label: "Google Drive Sync" },
    { id: "pwa", label: "PWA and Offline" },
    { id: "export", label: "Data Export and Import" },
    { id: "rights", label: "Your Rights" },
    { id: "changes", label: "Changes" },
    { id: "contact", label: "Contact" },
];

export default function PrivacyPage() {
    const [activeSection, setActiveSection] = React.useState<string | null>(null);

    React.useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                        break;
                    }
                }
            },
            { rootMargin: "-80px 0px -60% 0px" }
        );
        document.querySelectorAll("[data-section]").forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="max-w-4xl mx-auto px-4 py-12">
                <Button variant="ghost" size="sm" asChild className="mb-8 -ml-2">
                    <Link href="/" className="flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Back to FivWall
                    </Link>
                </Button>

                <header className="mb-12">
                    <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
                        <Shield className="w-8 h-8 text-primary" />
                        Privacy Policy
                    </h1>
                    <p className="text-muted-foreground">
                        Last updated: {new Date().toLocaleDateString()}
                    </p>
                </header>

                <div className="flex gap-12">
                    <nav className="hidden lg:block w-48 shrink-0">
                        <div className="sticky top-24 space-y-1">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                                On this page
                            </p>
                            {SECTIONS.map((s) => (
                                <a
                                    key={s.id}
                                    href={`#${s.id}`}
                                    className={cn(
                                        "block text-sm py-1.5 px-2 rounded-md transition-colors",
                                        activeSection === s.id
                                            ? "text-primary font-medium bg-primary/10"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                    )}
                                >
                                    {s.label}
                                </a>
                            ))}
                        </div>
                    </nav>

                    <main className="flex-1 min-w-0 space-y-10">
                        <section id="intro" data-section className="space-y-4">
                            <h2 className="text-xl font-semibold">1. Introduction</h2>
                            <div className="p-4 bg-muted/50 rounded-xl border border-border/50">
                                <p className="text-muted-foreground">
                                    FivWall is a privacy-first visual note-taking application developed by Fivex Labs.
                                    We are committed to protecting your privacy. This policy explains how we handle
                                    your data when you use FivWall.
                                </p>
                            </div>
                        </section>

                        <section id="data" data-section className="space-y-4">
                            <h2 className="text-xl font-semibold">2. Data We Collect</h2>
                            <div className="p-4 bg-muted/50 rounded-xl border border-border/50">
                                <p className="text-muted-foreground">
                                    FivWall stores your notes, preferences, and recent searches locally on your device
                                    using your browser&apos;s local storage. When you optionally use Google Drive sync,
                                    we also access your Google account information (email, name, profile picture) solely
                                    to enable the sync feature and display your account.
                                </p>
                            </div>
                        </section>

                        <section id="storage" data-section className="space-y-4">
                            <h2 className="text-xl font-semibold">3. How We Store Data</h2>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                                    <Lock className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium text-green-700 dark:text-green-400">Local storage</p>
                                        <p className="text-sm text-muted-foreground">
                                            All your notes and data are stored on your device in your browser&apos;s local storage.
                                            Nothing is sent to our servers or any external backend.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-xl">
                                    <HardDrive className="w-5 h-5 text-cyan-500 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium text-cyan-700 dark:text-cyan-400">Google Drive sync (optional)</p>
                                        <p className="text-sm text-muted-foreground">
                                            If you choose to sign in with Google, your data is stored in a dedicated &quot;FivWall&quot;
                                            folder in your own Google Drive. We use the <code className="px-1.5 py-0.5 bg-muted rounded text-xs">drive.file</code> scope,
                                            which means we can only access files that FivWall creates—not your other Drive files.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section id="not-do" data-section className="space-y-4">
                            <h2 className="text-xl font-semibold">4. What We Do NOT Do</h2>
                            <div className="p-4 border border-destructive/20 bg-destructive/5 rounded-xl space-y-2">
                                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                    <li>We do not store your data on our servers</li>
                                    <li>We do not use analytics or tracking</li>
                                    <li>We do not sell or share your data with third parties</li>
                                    <li>We do not use cookies for tracking purposes</li>
                                </ul>
                            </div>
                        </section>

                        <section id="drive" data-section className="space-y-4">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <Cloud className="w-5 h-5 text-cyan-500" />
                                5. Google Drive Sync
                            </h2>
                            <div className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-xl space-y-2">
                                <p className="text-sm text-muted-foreground">
                                    Google Drive sync is an optional feature. When you enable it, Google&apos;s OAuth flow is used
                                    to obtain access. You consent to Google&apos;s terms when you sign in. Your access token is
                                    kept in memory only and is not stored on our servers. We do not have access to your Drive
                                    outside of the FivWall folder we create.
                                </p>
                            </div>
                        </section>

                        <section id="pwa" data-section className="space-y-4">
                            <h2 className="text-xl font-semibold">6. PWA and Offline</h2>
                            <div className="p-4 bg-muted/50 rounded-xl border border-border/50">
                                <p className="text-muted-foreground">
                                    FivWall works as a Progressive Web App (PWA). The service worker caches app assets for
                                    offline use. Your data remains in local storage and is not transmitted when you are offline.
                                </p>
                            </div>
                        </section>

                        <section id="export" data-section className="space-y-4">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <FileText className="w-5 h-5 text-orange-500" />
                                7. Data Export and Import
                            </h2>
                            <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                                <p className="text-sm text-muted-foreground">
                                    You can export your data as a JSON file at any time. You can import it on another device
                                    or restore from a backup. You have full control over your data.
                                </p>
                            </div>
                        </section>

                        <section id="rights" data-section className="space-y-4">
                            <h2 className="text-xl font-semibold">8. Your Rights</h2>
                            <div className="p-4 bg-muted/50 rounded-xl border border-border/50">
                                <p className="text-muted-foreground">
                                    You can access, export, or delete your data at any time. Use the &quot;Wipe All Data&quot; option
                                    in the sidebar to permanently delete all local data. If you use Google Drive sync, you can
                                    also delete the FivWall folder from your Drive.
                                </p>
                            </div>
                        </section>

                        <section id="changes" data-section className="space-y-4">
                            <h2 className="text-xl font-semibold">9. Changes to This Policy</h2>
                            <div className="p-4 bg-muted/50 rounded-xl border border-border/50">
                                <p className="text-muted-foreground">
                                    We may update this privacy policy from time to time. We will notify you of any material
                                    changes by posting the new policy on this page and updating the &quot;Last updated&quot; date.
                                </p>
                            </div>
                        </section>

                        <section id="contact" data-section className="space-y-4">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <Mail className="w-5 h-5 text-primary" />
                                10. Contact
                            </h2>
                            <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
                                <p className="text-muted-foreground">
                                    If you have questions about this privacy policy, please contact us at{" "}
                                    <a
                                        href="https://fivexlabs.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline font-medium"
                                    >
                                        Fivex Labs
                                    </a>
                                    .
                                </p>
                            </div>
                        </section>

                        <div className="pt-8 border-t">
                            <Button variant="outline" asChild>
                                <Link href="/" className="flex items-center gap-2">
                                    <ArrowLeft className="w-4 h-4" />
                                    Back to FivWall
                                </Link>
                            </Button>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
