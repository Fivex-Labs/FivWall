"use client";

import * as React from "react";
import Link from "next/link";
import {
    Shield,
    Download,
    Upload,
    StickyNote,
    Search,
    Palette,
    Tag,
    Maximize2,
    Trash2,
    LayoutGrid,
    Kanban,
    MousePointer2,
    Keyboard,
    Lock,
    HardDrive,
    ExternalLink,
    Sparkles,
    Layers,
    Filter,
    Image,
    GripHorizontal,
    ArrowLeft,
    Cloud,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SECTIONS = [
    { id: "privacy", label: "Privacy & Data Security" },
    { id: "getting-started", label: "Getting Started" },
    { id: "editor", label: "Rich Text Editor" },
    { id: "features", label: "Core Features" },
    { id: "search", label: "Search & Navigation" },
    { id: "data", label: "Data Management" },
    { id: "sync", label: "Google Drive Sync" },
    { id: "use-cases", label: "Use Cases" },
    { id: "shortcuts", label: "Keyboard Shortcuts" },
    { id: "credits", label: "Credits" },
];

export default function HelpPage() {
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
        document.querySelectorAll("[data-help-section]").forEach((el) => observer.observe(el));
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
                        <Sparkles className="w-8 h-8 text-primary" />
                        Welcome to FivWall
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Your privacy-first visual note-taking workspace
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

                    <main className="flex-1 min-w-0 space-y-12">
                        <section id="privacy" data-help-section className="space-y-4">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <Shield className="w-5 h-5 text-green-500" />
                                Privacy & Data Security
                            </h2>
                            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-5 space-y-4">
                                <div className="flex items-start gap-3">
                                    <Lock className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium text-green-700 dark:text-green-400">100% Local Storage</p>
                                        <p className="text-sm text-muted-foreground">
                                            All your notes stay on your device. Nothing is sent to the cloud or any external servers unless you enable Google Drive sync.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <HardDrive className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium text-green-700 dark:text-green-400">Your Data, Your Control</p>
                                        <p className="text-sm text-muted-foreground">
                                            Export your data anytime and import it on another device. You own your information completely.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section id="getting-started" data-help-section className="space-y-4">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <StickyNote className="w-5 h-5 text-primary" />
                                Getting Started
                            </h2>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-xl border border-border/50">
                                    <MousePointer2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium">Create a Note</p>
                                        <p className="text-sm text-muted-foreground">
                                            Drag a color template from the sidebar onto the canvas. Your note appears instantly!
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-xl border border-border/50">
                                    <GripHorizontal className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium">Move Notes Around</p>
                                        <p className="text-sm text-muted-foreground">
                                            Click and drag the grip handle at the top of any note to reposition it on your canvas.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-xl border border-border/50">
                                    <Maximize2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium">Fullscreen Editing</p>
                                        <p className="text-sm text-muted-foreground">
                                            Click the maximize icon to edit your note in fullscreen mode for distraction-free writing.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section id="editor" data-help-section className="space-y-4">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <Keyboard className="w-5 h-5 text-emerald-500" />
                                Rich Text Editor
                            </h2>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                                    <span className="text-2xl font-mono mt-0.5 flex-shrink-0">/</span>
                                    <div>
                                        <p className="font-medium text-emerald-700 dark:text-emerald-400">Slash Commands</p>
                                        <p className="text-sm text-muted-foreground mb-2">
                                            Type <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">/</kbd> in any note to open the command menu.
                                            Insert headings, lists, tables, code blocks, and more!
                                        </p>
                                        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                                            <div>• Heading 1, 2, 3</div>
                                            <div>• Bullet List</div>
                                            <div>• Ordered List</div>
                                            <div>• Task List</div>
                                            <div>• Table (3×3)</div>
                                            <div>• Code Block</div>
                                            <div>• Divider</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-xl border border-border/50">
                                    <MousePointer2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium">Text Formatting</p>
                                        <p className="text-sm text-muted-foreground">
                                            Select any text to see a floating menu with formatting options: Bold, Italic, Strikethrough, Code, and Link.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section id="features" data-help-section className="space-y-4">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <Layers className="w-5 h-5 text-blue-500" />
                                Core Features
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {[
                                    { icon: LayoutGrid, title: "Wall View", desc: "Infinite canvas for free-form note placement. Perfect for brainstorming and visual organization.", color: "text-blue-500" },
                                    { icon: Kanban, title: "Board View", desc: "Kanban-style columns (To Do, In Progress, Done) for task management and workflow tracking.", color: "text-blue-500" },
                                    { icon: Palette, title: "Color Coding", desc: "8 beautiful colors to categorize and organize your notes visually.", color: "text-blue-500" },
                                    { icon: Tag, title: "Labels", desc: 'Add one label per note for easy categorization (e.g., "work", "personal", "ideas").', color: "text-blue-500" },
                                    { icon: Image, title: "Image Attachments", desc: "Attach images to your notes. Images are stored as Base64 for complete offline access.", color: "text-blue-500" },
                                    { icon: Filter, title: "Color Filter", desc: "Click color dots at the top to filter notes by color. Only shows colors currently in use.", color: "text-blue-500" },
                                ].map(({ icon: Icon, title, desc, color }) => (
                                    <div key={title} className="p-4 border rounded-xl space-y-2 hover:border-primary/30 transition-colors">
                                        <div className="flex items-center gap-2">
                                            <Icon className={cn("w-4 h-4", color)} />
                                            <p className="font-medium">{title}</p>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{desc}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section id="search" data-help-section className="space-y-4">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <Search className="w-5 h-5 text-purple-500" />
                                Search & Navigation
                            </h2>
                            <div className="flex items-start gap-3 p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                                <Keyboard className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="font-medium text-purple-700 dark:text-purple-400">Quick Search (⌘K / Ctrl+K)</p>
                                    <p className="text-sm text-muted-foreground">
                                        Press <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">⌘K</kbd> to open the command palette.
                                        Search through all your notes instantly by title or content.
                                    </p>
                                </div>
                            </div>
                            <div className="p-4 bg-muted/50 rounded-xl border border-border/50">
                                <p className="text-sm text-muted-foreground">
                                    <strong>Pro Tip:</strong> Click on a recent search to quickly populate the search field.
                                    Click any result or press <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Enter</kbd> to open in fullscreen.
                                </p>
                            </div>
                        </section>

                        <section id="data" data-help-section className="space-y-4">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <Download className="w-5 h-5 text-orange-500" />
                                Data Management
                            </h2>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3 p-4 border rounded-xl">
                                    <Download className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium">Export Data</p>
                                        <p className="text-sm text-muted-foreground mb-1">
                                            Download all your notes as a JSON file. Perfect for backups or transferring to another device.
                                        </p>
                                        <p className="text-xs text-muted-foreground">Sidebar → Export</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-4 border rounded-xl">
                                    <Upload className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium">Import Data</p>
                                        <p className="text-sm text-muted-foreground mb-1">
                                            Restore from a backup. Choose <strong>Append</strong> (keep existing) or <strong>Replace</strong> (wipe and restore).
                                        </p>
                                        <p className="text-xs text-muted-foreground">Sidebar → Import</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-4 border border-destructive/20 bg-destructive/5 rounded-xl">
                                    <Trash2 className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium text-destructive">Wipe All Data</p>
                                        <p className="text-sm text-muted-foreground mb-1">
                                            Permanently delete all notes. Requires typing &quot;DELETE ALL&quot; to confirm.
                                        </p>
                                        <p className="text-xs text-muted-foreground">Sidebar → Wipe All Data (when notes exist)</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section id="sync" data-help-section className="space-y-4">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <Cloud className="w-5 h-5 text-cyan-500" />
                                Google Drive Sync
                            </h2>
                            <div className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-xl space-y-3">
                                <p className="text-sm text-muted-foreground">
                                    Sign in with Google to sync your notes to a dedicated FivWall folder in your Google Drive.
                                    Sync happens automatically when you make changes, and you can see the last sync time in the top-right corner.
                                </p>
                                <div className="p-3 bg-background/50 rounded-lg border border-cyan-500/20">
                                    <p className="text-sm font-medium text-cyan-700 dark:text-cyan-400 mb-1">
                                        We value your privacy
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        You own the data within your own Google Drive. FivWall does not read or store your data on our servers—your notes stay in your Drive, and we only access the FivWall folder we create for sync.
                                    </p>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Sidebar → Sign in with Google (above Help)
                                </p>
                            </div>
                        </section>

                        <section id="use-cases" data-help-section className="space-y-4">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-yellow-500" />
                                Use Cases & Examples
                            </h2>
                            <div className="grid grid-cols-1 gap-3">
                                {[
                                    { emoji: "📚", title: "Study & Research", desc: "Create color-coded notes for different subjects. Use labels like \"math\", \"history\", \"science\". Attach diagrams and screenshots.", gradient: "from-blue-500/10 to-purple-500/10 border-blue-500/20" },
                                    { emoji: "💼", title: "Project Management", desc: "Use Board view to track tasks. Move notes between \"To Do\", \"In Progress\", and \"Done\". Color-code by priority or project.", gradient: "from-green-500/10 to-teal-500/10 border-green-500/20" },
                                    { emoji: "💡", title: "Brainstorming & Ideas", desc: "Use Wall view for free-form idea placement. Group related concepts by color. Drag notes to create visual connections.", gradient: "from-orange-500/10 to-red-500/10 border-orange-500/20" },
                                    { emoji: "📝", title: "Daily Journaling", desc: "Create a note for each day. Use different colors for mood tracking. Attach photos. Search past entries with ⌘K.", gradient: "from-pink-500/10 to-purple-500/10 border-pink-500/20" },
                                ].map(({ emoji, title, desc, gradient }) => (
                                    <div key={title} className={cn("p-4 bg-gradient-to-r rounded-xl border", gradient)}>
                                        <p className="font-medium mb-2">{emoji} {title}</p>
                                        <p className="text-sm text-muted-foreground">{desc}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section id="shortcuts" data-help-section className="space-y-4">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <Keyboard className="w-5 h-5 text-indigo-500" />
                                Keyboard Shortcuts
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                                    <span className="text-sm">Open Search</span>
                                    <kbd className="px-2 py-1 bg-background border rounded text-xs font-mono">⌘K / Ctrl+K</kbd>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                                    <span className="text-sm">Close Search/Dialog</span>
                                    <kbd className="px-2 py-1 bg-background border rounded text-xs font-mono">Esc</kbd>
                                </div>
                            </div>
                        </section>

                        <section id="credits" data-help-section className="space-y-4 pt-8 border-t">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <ExternalLink className="w-5 h-5 text-primary" />
                                Credits & Attribution
                            </h2>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3 p-4 bg-primary/5 border border-primary/20 rounded-xl">
                                    <img src="https://www.fivexlabs.com/logos/fx-1024.png" alt="Fivex Labs" className="w-12 h-12 rounded flex-shrink-0" />
                                    <div>
                                        <p className="font-medium">Developed by Fivex Labs</p>
                                        <p className="text-sm text-muted-foreground mb-2">
                                            FivWall is crafted with care by the team at Fivex Labs.
                                        </p>
                                        <Button variant="outline" size="sm" asChild className="gap-2">
                                            <a href="https://fivexlabs.com" target="_blank" rel="noopener noreferrer">
                                                <ExternalLink className="w-3 h-3" />
                                                Visit Fivex Labs
                                            </a>
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-4 bg-muted/50 border rounded-xl">
                                    <img src="/logos/fivui-logo-square.jpeg" alt="FivUI" className="w-12 h-12 rounded flex-shrink-0" />
                                    <div>
                                        <p className="font-medium">Powered by FivUI</p>
                                        <p className="text-sm text-muted-foreground mb-2">
                                            Beautiful, accessible UI components from FivUI.
                                        </p>
                                        <Button variant="outline" size="sm" asChild className="gap-2">
                                            <a href="https://ui.fivexlabs.com" target="_blank" rel="noopener noreferrer">
                                                <ExternalLink className="w-3 h-3" />
                                                Explore FivUI
                                            </a>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <div className="text-center text-sm text-muted-foreground pt-8 border-t">
                            <p>Made with care for privacy-conscious creators and thinkers</p>
                        </div>
                    </main>
                </div>

                <div className="mt-12 pt-8 border-t">
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
