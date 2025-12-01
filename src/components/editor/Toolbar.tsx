"use client";

import { type Editor } from '@tiptap/react';
import {
    Bold,
    Italic,
    Strikethrough,
    Code,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    CheckSquare,
    Link as LinkIcon,
    Table as TableIcon,
    Columns,
    Rows,
    Trash2,
    Minus,
    Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface ToolbarProps {
    editor: Editor | null;
}

export function Toolbar({ editor }: ToolbarProps) {
    if (!editor) {
        return null;
    }

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);

        // cancelled
        if (url === null) {
            return;
        }

        // empty
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        // update
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    return (
        <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-muted/20 sticky top-0 z-10">
            <div className="flex items-center gap-0.5 border-r pr-1 mr-1">
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn("h-7 w-7", editor.isActive('bold') && "bg-muted")}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    title="Bold"
                >
                    <Bold className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn("h-7 w-7", editor.isActive('italic') && "bg-muted")}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    title="Italic"
                >
                    <Italic className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn("h-7 w-7", editor.isActive('strike') && "bg-muted")}
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    title="Strike"
                >
                    <Strikethrough className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn("h-7 w-7", editor.isActive('code') && "bg-muted")}
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    title="Code"
                >
                    <Code className="h-4 w-4" />
                </Button>
            </div>

            <div className="flex items-center gap-0.5 border-r pr-1 mr-1">
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn("h-7 w-7", editor.isActive('heading', { level: 1 }) && "bg-muted")}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    title="Heading 1"
                >
                    <Heading1 className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn("h-7 w-7", editor.isActive('heading', { level: 2 }) && "bg-muted")}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    title="Heading 2"
                >
                    <Heading2 className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn("h-7 w-7", editor.isActive('heading', { level: 3 }) && "bg-muted")}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    title="Heading 3"
                >
                    <Heading3 className="h-4 w-4" />
                </Button>
            </div>

            <div className="flex items-center gap-0.5 border-r pr-1 mr-1">
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn("h-7 w-7", editor.isActive('bulletList') && "bg-muted")}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    title="Bullet List"
                >
                    <List className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn("h-7 w-7", editor.isActive('orderedList') && "bg-muted")}
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    title="Ordered List"
                >
                    <ListOrdered className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn("h-7 w-7", editor.isActive('taskList') && "bg-muted")}
                    onClick={() => editor.chain().focus().toggleTaskList().run()}
                    title="Task List"
                >
                    <CheckSquare className="h-4 w-4" />
                </Button>
            </div>

            <div className="flex items-center gap-0.5 border-r pr-1 mr-1">
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn("h-7 w-7", editor.isActive('link') && "bg-muted")}
                    onClick={setLink}
                    title="Link"
                >
                    <LinkIcon className="h-4 w-4" />
                </Button>
            </div>

            <div className="flex items-center gap-0.5">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn("h-7 w-7", editor.isActive('table') && "bg-muted")}
                            title="Table"
                        >
                            <TableIcon className="h-4 w-4" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-2" align="start">
                        <div className="grid grid-cols-2 gap-1">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="justify-start gap-2"
                                onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
                            >
                                <TableIcon className="h-4 w-4" />
                                Insert Table
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="justify-start gap-2 text-destructive"
                                onClick={() => editor.chain().focus().deleteTable().run()}
                                disabled={!editor.can().deleteTable()}
                            >
                                <Trash2 className="h-4 w-4" />
                                Delete Table
                            </Button>

                            <div className="col-span-2 h-px bg-border my-1" />

                            <Button
                                variant="ghost"
                                size="sm"
                                className="justify-start gap-2"
                                onClick={() => editor.chain().focus().addColumnBefore().run()}
                                disabled={!editor.can().addColumnBefore()}
                            >
                                <Columns className="h-4 w-4" />
                                Add Col Before
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="justify-start gap-2"
                                onClick={() => editor.chain().focus().addColumnAfter().run()}
                                disabled={!editor.can().addColumnAfter()}
                            >
                                <Columns className="h-4 w-4" />
                                Add Col After
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="justify-start gap-2"
                                onClick={() => editor.chain().focus().deleteColumn().run()}
                                disabled={!editor.can().deleteColumn()}
                            >
                                <Minus className="h-4 w-4" />
                                Delete Col
                            </Button>

                            <div className="col-span-2 h-px bg-border my-1" />

                            <Button
                                variant="ghost"
                                size="sm"
                                className="justify-start gap-2"
                                onClick={() => editor.chain().focus().addRowBefore().run()}
                                disabled={!editor.can().addRowBefore()}
                            >
                                <Rows className="h-4 w-4" />
                                Add Row Before
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="justify-start gap-2"
                                onClick={() => editor.chain().focus().addRowAfter().run()}
                                disabled={!editor.can().addRowAfter()}
                            >
                                <Rows className="h-4 w-4" />
                                Add Row After
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="justify-start gap-2"
                                onClick={() => editor.chain().focus().deleteRow().run()}
                                disabled={!editor.can().deleteRow()}
                            >
                                <Minus className="h-4 w-4" />
                                Delete Row
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
}
