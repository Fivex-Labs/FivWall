"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { useEffect, forwardRef, useImperativeHandle } from 'react';
import { cn } from '@/lib/utils';

export interface NoteEditorHandle {
    insertImage: (url: string) => void;
}

interface NoteEditorProps {
    content: string;
    onChange: (content: string) => void;
    editable?: boolean;
    className?: string;
}

export const NoteEditor = forwardRef<NoteEditorHandle, NoteEditorProps>(({ content, onChange, editable = true, className }, ref) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Image.configure({
                inline: true,
                allowBase64: true,
            }),
        ],
        // content, // Removed to rely on useEffect
        editable,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm dark:prose-invert focus:outline-none max-w-none min-h-[100px]',
            },
        },
        immediatelyRender: false,
    });

    useImperativeHandle(ref, () => ({
        insertImage: (url: string) => {
            editor?.chain().focus().setImage({ src: url }).run();
        }
    }));

    // Update content if it changes externally (e.g. from store)
    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            // Force update if content differs. This handles:
            // 1. Initial load with content
            // 2. Updates from other views
            // 3. Undo/Redo external sync
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    return (
        <div className={cn("w-full h-full cursor-text", className)} onClick={() => editor?.commands.focus()}>
            <EditorContent editor={editor} />
        </div>
    );
});

NoteEditor.displayName = "NoteEditor";
