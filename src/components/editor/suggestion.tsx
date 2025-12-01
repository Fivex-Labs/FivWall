import { ReactRenderer } from '@tiptap/react';
import tippy, { Instance } from 'tippy.js';
import { CommandList, CommandListRef } from './CommandList';
import { Heading1, Heading2, Heading3, List, ListOrdered, CheckSquare, Table, Image as ImageIcon, Code, Minus } from 'lucide-react';

export const getSuggestionItems = ({ query }: { query: string }) => {
    return [
        {
            title: 'Heading 1',
            icon: <Heading1 className="w-4 h-4" />,
      command: ({ editor, range }: any) => {
                editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run();
            },
        },
        {
            title: 'Heading 2',
            icon: <Heading2 className="w-4 h-4" />,
      command: ({ editor, range }: any) => {
                editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run();
            },
        },
        {
            title: 'Heading 3',
            icon: <Heading3 className="w-4 h-4" />,
      command: ({ editor, range }: any) => {
                editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run();
            },
        },
        {
            title: 'Bullet List',
            icon: <List className="w-4 h-4" />,
      command: ({ editor, range }: any) => {
                editor.chain().focus().deleteRange(range).toggleBulletList().run();
            },
        },
        {
            title: 'Ordered List',
            icon: <ListOrdered className="w-4 h-4" />,
      command: ({ editor, range }: any) => {
                editor.chain().focus().deleteRange(range).toggleOrderedList().run();
            },
        },
        {
            title: 'Task List',
            icon: <CheckSquare className="w-4 h-4" />,
      command: ({ editor, range }: any) => {
                editor.chain().focus().deleteRange(range).toggleTaskList().run();
            },
        },
        {
            title: 'Table',
            icon: <Table className="w-4 h-4" />,
      command: ({ editor, range }: any) => {
                editor.chain().focus().deleteRange(range).insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
            },
        },
        {
            title: 'Code Block',
            icon: <Code className="w-4 h-4" />,
      command: ({ editor, range }: any) => {
                editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
            },
        },
        {
            title: 'Divider',
            icon: <Minus className="w-4 h-4" />,
      command: ({ editor, range }: any) => {
                editor.chain().focus().deleteRange(range).setHorizontalRule().run();
            },
        },
    ].filter((item) => item.title.toLowerCase().startsWith(query.toLowerCase()));
};

export const renderSuggestion = () => {
    let component: ReactRenderer<CommandListRef, any>;
    let popup: Instance[];

    return {
        onStart: (props: any) => {
            component = new ReactRenderer(CommandList, {
                props,
                editor: props.editor,
            });

            if (!props.clientRect) {
                return;
            }

            popup = tippy('body', {
                getReferenceClientRect: props.clientRect,
                appendTo: () => document.body,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: 'manual',
                placement: 'bottom-start',
            });
        },

        onUpdate: (props: any) => {
            component.updateProps(props);

            if (!props.clientRect) {
                return;
            }

            popup[0].setProps({
                getReferenceClientRect: props.clientRect,
            });
        },

        onKeyDown: (props: any) => {
            if (props.event.key === 'Escape') {
                popup[0].hide();
                return true;
            }

            return component.ref?.onKeyDown(props);
        },

        onExit: () => {
            popup[0].destroy();
            component.destroy();
        },
    };
};
