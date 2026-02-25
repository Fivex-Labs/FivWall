import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
    title: "Privacy Policy | FivWall",
    description: "Privacy Policy for FivWall - your privacy-first note-taking app",
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="max-w-3xl mx-auto px-4 py-12 prose prose-invert prose-neutral max-w-none">
                <Button variant="ghost" size="sm" asChild className="mb-8 -ml-2">
                    <Link href="/" className="flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Back to FivWall
                    </Link>
                </Button>

                <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
                <p className="text-muted-foreground text-sm mb-8">
                    Last updated: {new Date().toLocaleDateString()}
                </p>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold">1. Introduction</h2>
                    <p>
                        FivWall is a privacy-first visual note-taking application developed by Fivex Labs.
                        We are committed to protecting your privacy. This policy explains how we handle
                        your data when you use FivWall.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold">2. Data We Collect</h2>
                    <p>
                        FivWall stores your notes, preferences, and recent searches locally on your device
                        using your browser&apos;s local storage. When you optionally use Google Drive sync,
                        we also access your Google account information (email) solely to enable the sync
                        feature.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold">3. How We Store Data</h2>
                    <p>
                        <strong>Local storage:</strong> All your notes and data are stored on your device
                        in your browser&apos;s local storage. Nothing is sent to our servers or any external
                        backend.
                    </p>
                    <p>
                        <strong>Google Drive sync (optional):</strong> If you choose to sign in with
                        Google, your data is stored in a dedicated &quot;FivWall&quot; folder in your
                        own Google Drive. We use the <code>drive.file</code> scope, which means we can
                        only access files that FivWall creates—not your other Drive files.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold">4. What We Do NOT Do</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>We do not store your data on our servers</li>
                        <li>We do not use analytics or tracking</li>
                        <li>We do not sell or share your data with third parties</li>
                        <li>We do not use cookies for tracking purposes</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold">5. Google Drive Sync</h2>
                    <p>
                        Google Drive sync is an optional feature. When you enable it, Google&apos;s OAuth
                        flow is used to obtain access. You consent to Google&apos;s terms when you sign in.
                        Your access token is kept in memory only and is not stored on our servers. We do
                        not have access to your Drive outside of the FivWall folder we create.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold">6. PWA and Offline</h2>
                    <p>
                        FivWall works as a Progressive Web App (PWA). The service worker caches app
                        assets for offline use. Your data remains in local storage and is not transmitted
                        when you are offline.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold">7. Data Export and Import</h2>
                    <p>
                        You can export your data as a JSON file at any time. You can import it on another
                        device or restore from a backup. You have full control over your data.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold">8. Your Rights</h2>
                    <p>
                        You can access, export, or delete your data at any time. Use the &quot;Wipe All
                        Data&quot; option in the sidebar to permanently delete all local data. If you use
                        Google Drive sync, you can also delete the FivWall folder from your Drive.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold">9. Changes to This Policy</h2>
                    <p>
                        We may update this privacy policy from time to time. We will notify you of any
                        material changes by posting the new policy on this page and updating the
                        &quot;Last updated&quot; date.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold">10. Contact</h2>
                    <p>
                        If you have questions about this privacy policy, please contact us at{" "}
                        <a
                            href="https://fivexlabs.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                        >
                            Fivex Labs
                        </a>
                        .
                    </p>
                </section>

                <div className="pt-8 border-t mt-8">
                    <Button variant="outline" asChild>
                        <Link href="/" className="flex items-center gap-2">
                            <ArrowLeft className="w-4 h-4" />
                            Back to FivWall
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
