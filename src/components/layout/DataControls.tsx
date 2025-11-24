"use client";

import * as React from "react";
import { useNoteStore } from "@/store/useNoteStore";
import { Button } from "@/components/ui/button";
import { Download, Upload, Loader2, Trash2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";

type AlertType = 'success' | 'error' | null;

export function DataControls() {
    const { notes, recentSearches, importData, clearAllData } = useNoteStore();
    const [isImporting, setIsImporting] = React.useState(false);
    const [pendingData, setPendingData] = React.useState<any>(null);
    const [showConflictDialog, setShowConflictDialog] = React.useState(false);
    const [showWipeDialog, setShowWipeDialog] = React.useState(false);
    const [wipeConfirmation, setWipeConfirmation] = React.useState("");
    const [alertState, setAlertState] = React.useState<{ show: boolean; type: AlertType; message: string }>({
        show: false,
        type: null,
        message: '',
    });
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const showAlert = (type: AlertType, message: string) => {
        setAlertState({ show: true, type, message });
    };

    const handleExport = () => {
        const data = {
            version: 1,
            timestamp: Date.now(),
            notes,
            recentSearches,
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `fivwall-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const processImport = (data: any, mode: 'replace' | 'append') => {
        setIsImporting(true);
        try {
            const success = importData(data, mode);
            if (success) {
                showAlert('success', "Data imported successfully!");
            } else {
                showAlert('error', "Failed to import data. Invalid format.");
            }
        } catch (err) {
            console.error("Import error", err);
            showAlert('error', "Failed to parse file.");
        } finally {
            setIsImporting(false);
            setPendingData(null);
            setShowConflictDialog(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const result = e.target?.result as string;
                const data = JSON.parse(result);

                // Check if we have existing notes
                if (notes.length > 0) {
                    setPendingData(data);
                    setShowConflictDialog(true);
                } else {
                    // No existing data, just import (replace is fine as it's empty)
                    processImport(data, 'replace');
                }
            } catch (err) {
                console.error("Import error", err);
                showAlert('error', "Failed to parse file.");
                if (fileInputRef.current) fileInputRef.current.value = '';
            }
        };
        reader.readAsText(file);
    };

    const handleWipeData = () => {
        if (wipeConfirmation === "DELETE ALL") {
            clearAllData();
            setShowWipeDialog(false);
            setWipeConfirmation("");
            showAlert('success', "All data has been wiped.");
        }
    };

    return (
        <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border">
            <Button
                variant="ghost"
                size="sm"
                onClick={handleExport}
                className="justify-start gap-2"
                title="Export"
            >
                <Download className="w-4 h-4" />
                <span className="hidden md:inline">Export</span>
            </Button>

            <div className="relative">
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept=".json"
                    onChange={handleFileChange}
                />
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleImportClick}
                    disabled={isImporting}
                    className="justify-start gap-2 w-full"
                    title="Import"
                >
                    {isImporting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Upload className="w-4 h-4" />
                    )}
                    <span className="hidden md:inline">Import</span>
                </Button>
            </div>

            {notes.length > 0 && (
                <div className="mt-2 pt-2 border-t border-border">
                    <Dialog open={showWipeDialog} onOpenChange={setShowWipeDialog}>
                        <DialogTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="justify-start gap-2 w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                                title="Wipe All Data"
                            >
                                <Trash2 className="w-4 h-4" />
                                <span className="hidden md:inline">Wipe All Data</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Wipe All Data</DialogTitle>
                                <DialogDescription>
                                    This action cannot be undone. All your notes and data will be permanently deleted.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="py-4 space-y-4">
                                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                                    <p className="text-sm text-destructive font-semibold">⚠️ Warning</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        You are about to delete {notes.length} note{notes.length !== 1 ? 's' : ''} and all associated data.
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">
                                        Type <span className="font-mono bg-muted px-1 py-0.5 rounded">DELETE ALL</span> to confirm:
                                    </label>
                                    <Input
                                        value={wipeConfirmation}
                                        onChange={(e) => setWipeConfirmation(e.target.value)}
                                        placeholder="DELETE ALL"
                                        className="mt-2"
                                    />
                                </div>
                                <Button
                                    onClick={handleWipeData}
                                    disabled={wipeConfirmation !== "DELETE ALL"}
                                    variant="destructive"
                                    className="w-full"
                                >
                                    Wipe All Data
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            )}

            <Dialog open={showConflictDialog} onOpenChange={setShowConflictDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Import Data</DialogTitle>
                        <DialogDescription>
                            You already have notes on your wall. How would you like to handle the imported data?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-3 py-4">
                        <Button
                            onClick={() => processImport(pendingData, 'append')}
                            className="w-full justify-start"
                            variant="outline"
                        >
                            <div className="flex flex-col items-start text-left">
                                <span className="font-semibold">Append</span>
                                <span className="text-xs text-muted-foreground">Add imported notes to existing ones (keeps both)</span>
                            </div>
                        </Button>
                        <Button
                            onClick={() => processImport(pendingData, 'replace')}
                            className="w-full justify-start"
                            variant="destructive"
                        >
                            <div className="flex flex-col items-start text-left">
                                <span className="font-semibold">Replace</span>
                                <span className="text-xs text-white/80">Delete existing notes and replace with imported ones</span>
                            </div>
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Alert Dialog for success/error messages */}
            <AlertDialog open={alertState.show} onOpenChange={(open) => setAlertState(prev => ({ ...prev, show: open }))}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {alertState.type === 'success' ? '✓ Success' : '✗ Error'}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {alertState.message}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => setAlertState({ show: false, type: null, message: '' })}>
                            OK
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

