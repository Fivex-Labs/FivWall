"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, FileText, Scale, Shield, BookOpen, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SECTIONS = [
    { id: "acceptance", label: "Acceptance of Terms" },
    { id: "service", label: "Description of Service" },
    { id: "use", label: "Acceptable Use" },
    { id: "warranties", label: "No Warranties" },
    { id: "liability", label: "Limitation of Liability" },
    { id: "ip", label: "Intellectual Property" },
    { id: "termination", label: "Termination" },
    { id: "changes", label: "Changes to Terms" },
    { id: "contact", label: "Contact" },
];

export default function TermsPage() {
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
                        <FileText className="w-8 h-8 text-primary" />
                        Terms of Service
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
                        <section id="acceptance" data-section className="space-y-4">
                            <h2 className="text-xl font-semibold">1. Acceptance of Terms</h2>
                            <div className="p-4 bg-muted/50 rounded-xl border border-border/50">
                                <p className="text-muted-foreground">
                                    By using FivWall, you agree to these Terms of Service. If you do not agree,
                                    please do not use the application.
                                </p>
                            </div>
                        </section>

                        <section id="service" data-section className="space-y-4">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-primary" />
                                2. Description of Service
                            </h2>
                            <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
                                <p className="text-muted-foreground">
                                    FivWall is a local-first, visual note-taking application. It provides an infinite
                                    canvas for creating and organizing notes, with optional Google Drive sync for users
                                    who prefer cloud backup. The service is provided &quot;as is&quot; by Fivex Labs.
                                </p>
                            </div>
                        </section>

                        <section id="use" data-section className="space-y-4">
                            <h2 className="text-xl font-semibold">3. Acceptable Use</h2>
                            <div className="p-4 bg-muted/50 rounded-xl border border-border/50">
                                <p className="text-muted-foreground">
                                    You agree to use FivWall only for lawful purposes. You may not use the application
                                    to store, transmit, or share content that is illegal, harmful, threatening, abusive,
                                    or otherwise objectionable. You are responsible for the content you create and store.
                                </p>
                            </div>
                        </section>

                        <section id="warranties" data-section className="space-y-4">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <Shield className="w-5 h-5 text-amber-500" />
                                4. No Warranties
                            </h2>
                            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                                <p className="text-sm text-muted-foreground">
                                    FivWall is provided &quot;AS IS&quot; without warranties of any kind, express or implied.
                                    We do not guarantee that the service will be uninterrupted, error-free, or secure.
                                    Use at your own risk.
                                </p>
                            </div>
                        </section>

                        <section id="liability" data-section className="space-y-4">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <Scale className="w-5 h-5 text-amber-500" />
                                5. Limitation of Liability
                            </h2>
                            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                                <p className="text-sm text-muted-foreground">
                                    To the extent permitted by law, Fivex Labs shall not be liable for any indirect,
                                    incidental, special, consequential, or punitive damages arising from your use of
                                    FivWall. Your total liability is limited to the amount you paid for the service
                                    (if any).
                                </p>
                            </div>
                        </section>

                        <section id="ip" data-section className="space-y-4">
                            <h2 className="text-xl font-semibold">6. Intellectual Property</h2>
                            <div className="p-4 bg-muted/50 rounded-xl border border-border/50">
                                <p className="text-muted-foreground">
                                    You retain all rights to the content you create in FivWall. Fivex Labs owns the
                                    FivWall application, its design, and its code. You may not copy, modify, or
                                    distribute the application without permission.
                                </p>
                            </div>
                        </section>

                        <section id="termination" data-section className="space-y-4">
                            <h2 className="text-xl font-semibold">7. Termination</h2>
                            <div className="p-4 bg-muted/50 rounded-xl border border-border/50">
                                <p className="text-muted-foreground">
                                    You may stop using FivWall at any time. Your data remains in your local storage
                                    and, if you used Google Drive sync, in your Google Drive. We reserve the right to
                                    discontinue or modify the service with reasonable notice.
                                </p>
                            </div>
                        </section>

                        <section id="changes" data-section className="space-y-4">
                            <h2 className="text-xl font-semibold">8. Changes to Terms</h2>
                            <div className="p-4 bg-muted/50 rounded-xl border border-border/50">
                                <p className="text-muted-foreground">
                                    We may update these terms from time to time. Continued use of FivWall after changes
                                    constitutes acceptance of the new terms. We will notify you of material changes by
                                    posting the updated terms on this page.
                                </p>
                            </div>
                        </section>

                        <section id="contact" data-section className="space-y-4">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <Mail className="w-5 h-5 text-primary" />
                                9. Contact
                            </h2>
                            <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
                                <p className="text-muted-foreground">
                                    For questions about these Terms of Service, please contact us at{" "}
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
