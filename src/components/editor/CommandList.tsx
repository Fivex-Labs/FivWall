"use client";

import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Heading1, Heading2, Heading3, List, ListOrdered, CheckSquare, Table, Image as ImageIcon, Code } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface CommandListRef {
    onKeyDown: (props: { event: KeyboardEvent }) => boolean;
}

interface CommandListProps {
    items: any[];
    command: (item: any) => void;
}

export const CommandList = forwardRef<CommandListRef, CommandListProps>((props, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectItem = (index: number) => {
        const item = props.items[index];
        if (item) {
            props.command(item);
        }
    };

    useEffect(() => {
        setSelectedIndex(0);
    }, [props.items]);

    useImperativeHandle(ref, () => ({
        onKeyDown: ({ event }) => {
            if (event.key === 'ArrowUp') {
                setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
                return true;
            }

            if (event.key === 'ArrowDown') {
                setSelectedIndex((selectedIndex + 1) % props.items.length);
                return true;
            }

            if (event.key === 'Enter') {
                selectItem(selectedIndex);
                return true;
            }

            return false;
        },
    }));

    return (
        <div className="z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95">
            <div className="flex flex-col gap-0.5">
                {props.items.map((item, index) => (
                    <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        className={cn(
                            "justify-start gap-2 px-2 py-1.5 h-auto font-normal",
                            index === selectedIndex ? "bg-accent text-accent-foreground" : ""
                        )}
                        onClick={() => selectItem(index)}
                    >
                        {item.icon}
                        <span>{item.title}</span>
                    </Button>
                ))}
            </div>
        </div>
    );
});

CommandList.displayName = 'CommandList';
