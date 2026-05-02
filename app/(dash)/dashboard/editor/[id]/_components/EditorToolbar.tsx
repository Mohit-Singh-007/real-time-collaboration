"use client";

import { type Editor, useEditorState } from "@tiptap/react";
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";
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
  Quote,
  Minus,
  Undo,
  Redo,
} from "lucide-react";

export function EditorToolbar({ editor }: { editor: Editor | null }) {
  // Subscribe to every editor transaction so active-state re-renders correctly
  // (without this, editor.isActive() is only read at mount time)
  const state = useEditorState({
    editor,
    selector: (ctx) => ({
      isBold: ctx.editor?.isActive("bold") ?? false,
      isItalic: ctx.editor?.isActive("italic") ?? false,
      isStrike: ctx.editor?.isActive("strike") ?? false,
      isCode: ctx.editor?.isActive("code") ?? false,
      isH1: ctx.editor?.isActive("heading", { level: 1 }) ?? false,
      isH2: ctx.editor?.isActive("heading", { level: 2 }) ?? false,
      isH3: ctx.editor?.isActive("heading", { level: 3 }) ?? false,
      isBulletList: ctx.editor?.isActive("bulletList") ?? false,
      isOrderedList: ctx.editor?.isActive("orderedList") ?? false,
      isBlockquote: ctx.editor?.isActive("blockquote") ?? false,
    }),
  });

  if (!editor) return null;

  const btn = (
    label: string,
    icon: React.ReactNode,
    action: () => void,
    active?: boolean,
  ) => (
    <Toggle
      size="sm"
      pressed={active}
      // Prevent the button from stealing focus from the editor.
      // If focus moves away, ProseMirror resets stored marks from the
      // cursor position when `.focus()` is called, overwriting any mark
      // changes that were just made (bold stuck on, marks lost on H1 toggle, etc.)
      onMouseDown={(e) => e.preventDefault()}
      onPressedChange={() => action()}
      aria-label={label}
      className="h-8 w-8 p-0 data-[state=on]:bg-[#f0d4bb] data-[state=on]:text-[#c8601a]"
    >
      {icon}
    </Toggle>
  );

  return (
    <div className="flex items-center gap-0.5 px-4 py-2 border-b border-[#ddd8cd] bg-white flex-wrap">
      {/* history */}
      {btn("Undo", <Undo className="h-3.5 w-3.5" />, () =>
        editor.chain().focus().undo().run(),
      )}
      {btn("Redo", <Redo className="h-3.5 w-3.5" />, () =>
        editor.chain().focus().redo().run(),
      )}

      <Separator orientation="vertical" className="h-5 mx-1" />

      {/* headings */}
      {btn(
        "H1",
        <Heading1 className="h-3.5 w-3.5" />,
        () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
        state?.isH1,
      )}
      {btn(
        "H2",
        <Heading2 className="h-3.5 w-3.5" />,
        () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
        state?.isH2,
      )}
      {btn(
        "H3",
        <Heading3 className="h-3.5 w-3.5" />,
        () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
        state?.isH3,
      )}

      <Separator orientation="vertical" className="h-5 mx-1" />

      {/* marks */}
      {btn(
        "Bold",
        <Bold className="h-3.5 w-3.5" />,
        () => editor.chain().focus().toggleBold().run(),
        state?.isBold,
      )}
      {btn(
        "Italic",
        <Italic className="h-3.5 w-3.5" />,
        () => editor.chain().focus().toggleItalic().run(),
        state?.isItalic,
      )}
      {btn(
        "Strike",
        <Strikethrough className="h-3.5 w-3.5" />,
        () => editor.chain().focus().toggleStrike().run(),
        state?.isStrike,
      )}
      {btn(
        "Code",
        <Code className="h-3.5 w-3.5" />,
        () => editor.chain().focus().toggleCode().run(),
        state?.isCode,
      )}

      <Separator orientation="vertical" className="h-5 mx-1" />

      {/* lists */}
      {btn(
        "Bullet list",
        <List className="h-3.5 w-3.5" />,
        () => editor.chain().focus().toggleBulletList().run(),
        state?.isBulletList,
      )}
      {btn(
        "Ordered list",
        <ListOrdered className="h-3.5 w-3.5" />,
        () => editor.chain().focus().toggleOrderedList().run(),
        state?.isOrderedList,
      )}
      {btn(
        "Blockquote",
        <Quote className="h-3.5 w-3.5" />,
        () => editor.chain().focus().toggleBlockquote().run(),
        state?.isBlockquote,
      )}
      {btn("Divider", <Minus className="h-3.5 w-3.5" />, () =>
        editor.chain().focus().setHorizontalRule().run(),
      )}
    </div>
  );
}
