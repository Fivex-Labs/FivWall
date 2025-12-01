"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TaskList } from '@tiptap/extension-task-list';
import { TaskItem } from '@tiptap/extension-task-item';
import { Link } from '@tiptap/extension-link';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Extension } from '@tiptap/core';
import Suggestion from '@tiptap/suggestion';
import { useEffect, forwardRef, useImperativeHandle } from 'react';
import { cn } from '@/lib/utils';
import { getSuggestionItems, renderSuggestion } from './suggestion';
import { Bold, Italic, Strikethrough, Code, Link as LinkIcon } from 'lucide-react';

export interface NoteEditorHandle {
    insertImage: (url: string) => void;
}

interface NoteEditorProps {
    content: string;
    onChange: (content: string) => void;
    editable?: boolean;
    className?: string;
    showToolbar?: boolean; // Kept for prop compatibility but ignored for fixed toolbar
    isLightBackground?: boolean; // To control prose color scheme
}

export const NoteEditor = forwardRef<NoteEditorHandle, NoteEditorProps>(({ content, onChange, editable = true, className, isLightBackground = false }, ref) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Image.configure({
                inline: true,
                allowBase64: true,
            }),
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
            TaskList,
            TaskItem.configure({
                nested: true,
            }),
            Link.configure({
                openOnClick: false,
            }),
            Placeholder.configure({
                placeholder: "Write or press '/' for commands...",
                emptyEditorClass: 'is-editor-empty',
            }),
            Extension.create({
                name: 'slash-command',
                addOptions() {
                    return {
                        suggestion: {
                            char: '/',
                            command: ({ editor, range, props }: any) => {
                                props.command({ editor, range });
                            },
                        },
                    };
                },
                addProseMirrorPlugins() {
                    return [
                        Suggestion({
                            editor: this.editor,
                            ...this.options.suggestion,
                        }),
                    ];
                },
            }).configure({
                suggestion: {
                    items: getSuggestionItems,
                    render: renderSuggestion,
                },
            }),
        ],
        editable,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: cn(
                    'prose prose-sm focus:outline-none max-w-none min-h-[100px] px-4 py-2',
                    isLightBackground ? 'prose-neutral' : 'prose-invert'
                ),
            },
        },
        immediatelyRender: false,
    });

    useImperativeHandle(ref, () => ({
        insertImage: (url: string) => {
            editor?.chain().focus().setImage({ src: url }).run();
        }
    }));

    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    const setLink = () => {
        if (!editor) return;
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);
        if (url === null) return;
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    return (
        <div className={cn("w-full h-full flex flex-col relative", className)}>
            {editor && (
                <BubbleMenu editor={editor} className="flex items-center gap-1 p-1 rounded-md border bg-popover shadow-md">{" "}
                    <button
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={cn("p-1 rounded hover:bg-muted", editor.isActive('bold') ? "bg-muted text-foreground" : "text-muted-foreground")}
                        title="Bold"
                    >
                        <Bold className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={cn("p-1 rounded hover:bg-muted", editor.isActive('italic') ? "bg-muted text-foreground" : "text-muted-foreground")}
                        title="Italic"
                    >
                        <Italic className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        className={cn("p-1 rounded hover:bg-muted", editor.isActive('strike') ? "bg-muted text-foreground" : "text-muted-foreground")}
                        title="Strike"
                    >
                        <Strikethrough className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleCode().run()}
                        className={cn("p-1 rounded hover:bg-muted", editor.isActive('code') ? "bg-muted text-foreground" : "text-muted-foreground")}
                        title="Code"
                    >
                        <Code className="w-4 h-4" />
                    </button>
                    <button
                        onClick={setLink}
                        className={cn("p-1 rounded hover:bg-muted", editor.isActive('link') ? "bg-muted text-foreground" : "text-muted-foreground")}
                        title="Link"
                    >
                        <LinkIcon className="w-4 h-4" />
                    </button>
                </BubbleMenu>
            )}

            <div className="flex-1 overflow-y-auto cursor-text" onClick={() => editor?.commands.focus()}>
                <EditorContent editor={editor} />
            </div>
        </div>
    );
});

NoteEditor.displayName = "NoteEditor";
