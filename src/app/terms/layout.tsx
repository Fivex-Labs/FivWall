import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Service | FivWall",
    description: "Terms of Service for FivWall - your privacy-first note-taking app",
};

export default function TermsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
