"use client";

import { useEditorState } from "@tiptap/react";
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
  Heading4,
  Heading5,
  Heading6,
  List,
  ListOrdered,
  Quote,
  Minus,
  Undo,
  Redo,
  Eraser,
  Type,
  CodeXml
} from "lucide-react";
import menuBarStateSelector from "./menuBarStateSelector";

export const EditorToolbar = ({ editor }: { editor: any }) => {
  const editorState = useEditorState({
    editor,
    selector: menuBarStateSelector,
  });

  if (!editor || !editorState) {
    return null;
  }

  const renderButton = (
    label: string,
    icon: React.ReactNode,
    action: () => void,
    active?: boolean,
    disabled?: boolean
  ) => (
    <Toggle
      size="sm"
      pressed={active}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onPressedChange={() => action()}
      aria-label={label}
      className="h-9 w-9 p-0 data-[state=on]:bg-orange-100 data-[state=on]:text-orange-600"
      title={label}
    >
      {icon}
    </Toggle>
  );

  return (
    <div className="flex flex-wrap items-center gap-1 p-1 bg-white border-b sticky top-0 z-10">
      <div className="flex items-center gap-1">
        {renderButton("Bold", <Bold className="h-4 w-4" />, () => editor.chain().focus().toggleBold().run(), editorState.isBold, !editorState.canBold)}
        {renderButton("Italic", <Italic className="h-4 w-4" />, () => editor.chain().focus().toggleItalic().run(), editorState.isItalic, !editorState.canItalic)}
        {renderButton("Strike", <Strikethrough className="h-4 w-4" />, () => editor.chain().focus().toggleStrike().run(), editorState.isStrike, !editorState.canStrike)}
        {renderButton("Code", <Code className="h-4 w-4" />, () => editor.chain().focus().toggleCode().run(), editorState.isCode, !editorState.canCode)}
      </div>

      <Separator orientation="vertical" className="h-6 mx-1" />

      <div className="flex items-center gap-1">
        {renderButton("Paragraph", <Type className="h-4 w-4" />, () => editor.chain().focus().setParagraph().run(), editorState.isParagraph)}
        {renderButton("H1", <Heading1 className="h-4 w-4" />, () => editor.chain().focus().toggleHeading({ level: 1 }).run(), editorState.isHeading1)}
        {renderButton("H2", <Heading2 className="h-4 w-4" />, () => editor.chain().focus().toggleHeading({ level: 2 }).run(), editorState.isHeading2)}
        {renderButton("H3", <Heading3 className="h-4 w-4" />, () => editor.chain().focus().toggleHeading({ level: 3 }).run(), editorState.isHeading3)}
        {renderButton("H4", <Heading4 className="h-4 w-4" />, () => editor.chain().focus().toggleHeading({ level: 4 }).run(), editorState.isHeading4)}
        {renderButton("H5", <Heading5 className="h-4 w-4" />, () => editor.chain().focus().toggleHeading({ level: 5 }).run(), editorState.isHeading5)}
        {renderButton("H6", <Heading6 className="h-4 w-4" />, () => editor.chain().focus().toggleHeading({ level: 6 }).run(), editorState.isHeading6)}
      </div>

      <Separator orientation="vertical" className="h-6 mx-1" />

      <div className="flex items-center gap-1">
        {renderButton("Bullet List", <List className="h-4 w-4" />, () => editor.chain().focus().toggleBulletList().run(), editorState.isBulletList)}
        {renderButton("Ordered List", <ListOrdered className="h-4 w-4" />, () => editor.chain().focus().toggleOrderedList().run(), editorState.isOrderedList)}
        {renderButton("Blockquote", <Quote className="h-4 w-4" />, () => editor.chain().focus().toggleBlockquote().run(), editorState.isBlockquote)}
        {renderButton("Code Block", <CodeXml className="h-4 w-4" />, () => editor.chain().focus().toggleCodeBlock().run(), editorState.isCodeBlock)}
      </div>

      <Separator orientation="vertical" className="h-6 mx-1" />

      <div className="flex items-center gap-1">
        {renderButton("Horizontal Rule", <Minus className="h-4 w-4" />, () => editor.chain().focus().setHorizontalRule().run())}
      </div>

      <div className="flex-grow" />

      <div className="flex items-center gap-1">
        {renderButton("Undo", <Undo className="h-4 w-4" />, () => editor.chain().focus().undo().run(), false, !editorState.canUndo)}
        {renderButton("Redo", <Redo className="h-4 w-4" />, () => editor.chain().focus().redo().run(), false, !editorState.canRedo)}
      </div>
    </div>
  );
};
