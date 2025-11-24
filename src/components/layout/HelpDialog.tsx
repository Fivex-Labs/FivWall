"use client";

import * as React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";

interface HelpDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function HelpDialog({ open, onOpenChange }: HelpDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-primary" />
                        Welcome to FivWall
                    </DialogTitle>
                    <DialogDescription>
                        Your privacy-first visual note-taking workspace
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Privacy First */}
                    <section className="space-y-3">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Shield className="w-5 h-5 text-green-500" />
                            Privacy & Data Security
                        </h3>
                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 space-y-2">
                            <div className="flex items-start gap-3">
                                <Lock className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="font-medium text-green-700 dark:text-green-400">100% Local Storage</p>
                                    <p className="text-sm text-muted-foreground">
                                        All your notes stay on your device. Nothing is sent to the cloud or any external servers.
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

                    {/* Getting Started */}
                    <section className="space-y-3">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <StickyNote className="w-5 h-5 text-primary" />
                            Getting Started
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                                <MousePointer2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="font-medium">Create a Note</p>
                                    <p className="text-sm text-muted-foreground">
                                        Drag a color template from the sidebar onto the canvas. Your note appears instantly!
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                                <GripHorizontal className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="font-medium">Move Notes Around</p>
                                    <p className="text-sm text-muted-foreground">
                                        Click and drag the grip handle at the top of any note to reposition it on your canvas.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
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

                    {/* Core Features */}
                    <section className="space-y-3">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Layers className="w-5 h-5 text-blue-500" />
                            Core Features
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="p-3 border rounded-lg space-y-2">
                                <div className="flex items-center gap-2">
                                    <LayoutGrid className="w-4 h-4 text-blue-500" />
                                    <p className="font-medium">Wall View</p>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Infinite canvas for free-form note placement. Perfect for brainstorming and visual organization.
                                </p>
                            </div>
                            <div className="p-3 border rounded-lg space-y-2">
                                <div className="flex items-center gap-2">
                                    <Kanban className="w-4 h-4 text-blue-500" />
                                    <p className="font-medium">Board View</p>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Kanban-style columns (To Do, In Progress, Done) for task management and workflow tracking.
                                </p>
                            </div>
                            <div className="p-3 border rounded-lg space-y-2">
                                <div className="flex items-center gap-2">
                                    <Palette className="w-4 h-4 text-blue-500" />
                                    <p className="font-medium">Color Coding</p>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    11 beautiful colors to categorize and organize your notes visually.
                                </p>
                            </div>
                            <div className="p-3 border rounded-lg space-y-2">
                                <div className="flex items-center gap-2">
                                    <Tag className="w-4 h-4 text-blue-500" />
                                    <p className="font-medium">Labels</p>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Add one label per note for easy categorization (e.g., "work", "personal", "ideas").
                                </p>
                            </div>
                            <div className="p-3 border rounded-lg space-y-2">
                                <div className="flex items-center gap-2">
                                    <Image className="w-4 h-4 text-blue-500" />
                                    <p className="font-medium">Image Attachments</p>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Attach images to your notes. Images are stored as Base64 for complete offline access.
                                </p>
                            </div>
                            <div className="p-3 border rounded-lg space-y-2">
                                <div className="flex items-center gap-2">
                                    <Filter className="w-4 h-4 text-blue-500" />
                                    <p className="font-medium">Color Filter</p>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Click color dots at the top to filter notes by color. Only shows colors currently in use.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Search & Navigation */}
                    <section className="space-y-3">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Search className="w-5 h-5 text-purple-500" />
                            Search & Navigation
                        </h3>
                        <div className="space-y-2">
                            <div className="flex items-start gap-3 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                                <Keyboard className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="font-medium text-purple-700 dark:text-purple-400">Quick Search (⌘K / Ctrl+K)</p>
                                    <p className="text-sm text-muted-foreground">
                                        Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">⌘K</kbd> to open the command palette.
                                        Search through all your notes instantly by title or content.
                                    </p>
                                </div>
                            </div>
                            <div className="p-3 bg-muted/50 rounded-lg">
                                <p className="text-sm text-muted-foreground">
                                    <strong>Pro Tip:</strong> Click on a recent search to quickly populate the search field.
                                    Click any result or press <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Enter</kbd> to open in fullscreen.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Data Management */}
                    <section className="space-y-3">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Download className="w-5 h-5 text-orange-500" />
                            Data Management
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3 p-3 border rounded-lg">
                                <Download className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="font-medium">Export Data</p>
                                    <p className="text-sm text-muted-foreground mb-2">
                                        Download all your notes as a JSON file. Perfect for backups or transferring to another device.
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Location: Sidebar → Export button
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 border rounded-lg">
                                <Upload className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="font-medium">Import Data</p>
                                    <p className="text-sm text-muted-foreground mb-2">
                                        Restore from a backup file. Choose to <strong>Append</strong> (keep existing notes) or <strong>Replace</strong> (wipe and restore).
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Location: Sidebar → Import button
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 border border-destructive/20 bg-destructive/5 rounded-lg">
                                <Trash2 className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="font-medium text-destructive">Wipe All Data</p>
                                    <p className="text-sm text-muted-foreground mb-2">
                                        Permanently delete all notes. Requires typing "DELETE ALL" to confirm. Use with caution!
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Location: Sidebar → Wipe All Data (only visible when notes exist)
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Use Cases */}
                    <section className="space-y-3">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-yellow-500" />
                            Use Cases & Examples
                        </h3>
                        <div className="grid grid-cols-1 gap-3">
                            <div className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg">
                                <p className="font-medium mb-2">📚 Study & Research</p>
                                <p className="text-sm text-muted-foreground">
                                    Create color-coded notes for different subjects. Use labels like "math", "history", "science".
                                    Attach diagrams and screenshots. Use Wall view for mind mapping.
                                </p>
                            </div>
                            <div className="p-4 bg-gradient-to-r from-green-500/10 to-teal-500/10 border border-green-500/20 rounded-lg">
                                <p className="font-medium mb-2">💼 Project Management</p>
                                <p className="text-sm text-muted-foreground">
                                    Use Board view to track tasks. Move notes between "To Do", "In Progress", and "Done".
                                    Color-code by priority or project. Add labels for team members or departments.
                                </p>
                            </div>
                            <div className="p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-lg">
                                <p className="font-medium mb-2">💡 Brainstorming & Ideas</p>
                                <p className="text-sm text-muted-foreground">
                                    Use Wall view for free-form idea placement. Group related concepts by color.
                                    Drag notes to create visual connections. Export when done to share with your team.
                                </p>
                            </div>
                            <div className="p-4 bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-lg">
                                <p className="font-medium mb-2">📝 Daily Journaling</p>
                                <p className="text-sm text-muted-foreground">
                                    Create a note for each day. Use different colors for mood tracking.
                                    Attach photos from your day. Search past entries instantly with ⌘K.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Keyboard Shortcuts */}
                    <section className="space-y-3">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Keyboard className="w-5 h-5 text-indigo-500" />
                            Keyboard Shortcuts
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                                <span className="text-sm">Open Search</span>
                                <kbd className="px-2 py-1 bg-background border rounded text-xs">⌘K / Ctrl+K</kbd>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                                <span className="text-sm">Close Search/Dialog</span>
                                <kbd className="px-2 py-1 bg-background border rounded text-xs">Esc</kbd>
                            </div>
                        </div>
                    </section>

                    {/* Credits */}
                    <section className="space-y-3 pt-4 border-t">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <ExternalLink className="w-5 h-5 text-primary" />
                            Credits & Attribution
                        </h3>
                        <div className="space-y-2">
                            <div className="flex items-start gap-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                                <img
                                    src="/logos/5x-logo-square.webp"
                                    alt="Fivex Labs"
                                    className="w-12 h-12 rounded flex-shrink-0"
                                />
                                <div>
                                    <p className="font-medium">Developed by Fivex Labs</p>
                                    <p className="text-sm text-muted-foreground mb-2">
                                        FivWall is crafted with care by the team at Fivex Labs, building innovative tools for productivity and creativity.
                                    </p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => window.open('https://fivexlabs.com', '_blank')}
                                        className="gap-2"
                                    >
                                        <ExternalLink className="w-3 h-3" />
                                        Visit Fivex Labs
                                    </Button>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-muted/50 border rounded-lg">
                                <img
                                    src="/logos/fivui-logo-square.jpeg"
                                    alt="FivUI"
                                    className="w-12 h-12 rounded flex-shrink-0"
                                />
                                <div>
                                    <p className="font-medium">Powered by FivUI</p>
                                    <p className="text-sm text-muted-foreground mb-2">
                                        The beautiful, accessible UI components you see are from FivUI - a comprehensive React component library.
                                    </p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => window.open('https://ui.fivexlabs.com', '_blank')}
                                        className="gap-2"
                                    >
                                        <ExternalLink className="w-3 h-3" />
                                        Explore FivUI
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Footer */}
                    <div className="text-center text-sm text-muted-foreground pt-4 border-t">
                        <p>Made with ❤️ for privacy-conscious creators and thinkers</p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
