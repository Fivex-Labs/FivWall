import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
    title: "Terms of Service | FivWall",
    description: "Terms of Service for FivWall - your privacy-first note-taking app",
};

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="max-w-3xl mx-auto px-4 py-12 prose prose-invert prose-neutral max-w-none">
                <Button variant="ghost" size="sm" asChild className="mb-8 -ml-2">
                    <Link href="/" className="flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Back to FivWall
                    </Link>
                </Button>

                <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
                <p className="text-muted-foreground text-sm mb-8">
                    Last updated: {new Date().toLocaleDateString()}
                </p>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold">1. Acceptance of Terms</h2>
                    <p>
                        By using FivWall, you agree to these Terms of Service. If you do not agree,
                        please do not use the application.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold">2. Description of Service</h2>
                    <p>
                        FivWall is a local-first, visual note-taking application. It provides an
                        infinite canvas for creating and organizing notes, with optional Google Drive
                        sync for users who prefer cloud backup. The service is provided &quot;as is&quot;
                        by Fivex Labs.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold">3. Acceptable Use</h2>
                    <p>
                        You agree to use FivWall only for lawful purposes. You may not use the
                        application to store, transmit, or share content that is illegal, harmful,
                        threatening, abusive, or otherwise objectionable. You are responsible for
                        the content you create and store.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold">4. No Warranties</h2>
                    <p>
                        FivWall is provided &quot;AS IS&quot; without warranties of any kind, express or
                        implied. We do not guarantee that the service will be uninterrupted, error-free,
                        or secure. Use at your own risk.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold">5. Limitation of Liability</h2>
                    <p>
                        To the extent permitted by law, Fivex Labs shall not be liable for any
                        indirect, incidental, special, consequential, or punitive damages arising from
                        your use of FivWall. Your total liability is limited to the amount you paid
                        for the service (if any).
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold">6. Intellectual Property</h2>
                    <p>
                        You retain all rights to the content you create in FivWall. Fivex Labs owns
                        the FivWall application, its design, and its code. You may not copy, modify,
                        or distribute the application without permission.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold">7. Termination</h2>
                    <p>
                        You may stop using FivWall at any time. Your data remains in your local
                        storage and, if you used Google Drive sync, in your Google Drive. We reserve
                        the right to discontinue or modify the service with reasonable notice.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold">8. Changes to Terms</h2>
                    <p>
                        We may update these terms from time to time. Continued use of FivWall after
                        changes constitutes acceptance of the new terms. We will notify you of material
                        changes by posting the updated terms on this page.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold">9. Contact</h2>
                    <p>
                        For questions about these Terms of Service, please contact us at{" "}
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
