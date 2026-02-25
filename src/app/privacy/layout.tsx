import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy | FivWall",
    description: "Privacy Policy for FivWall - your privacy-first note-taking app",
};

export default function PrivacyLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
