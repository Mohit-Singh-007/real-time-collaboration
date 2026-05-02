"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import CharacterCount from "@tiptap/extension-character-count";
import { useEffect, useRef, useState, useCallback } from "react";
import { saveSnapshot } from "@/app/lib/actions";
import { EditorHeader } from "./EditorHeader";
import { EditorToolbar } from "./EditorToolbar";

type Doc = {
  id: string;
  title: string;
  textContent: string;
  updatedAt: string;
};
type User = { id: string; name: string; image: string | null };
type Member = User & { role: "OWNER" | "EDITOR" | "VIEWER" };
type SaveStatus = "saved" | "saving" | "unsaved";

type Props = {
  doc: Doc;
  role: "OWNER" | "EDITOR" | "VIEWER";
  user: User;
  members: Member[];
};

const AUTOSAVE_DELAY = 3000; // 3s after last keystroke

export function EditorShell({ doc, role, user, members }: Props) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const [title, setTitle] = useState(doc.title);
  const saveTimer = useRef<ReturnType<typeof setTimeout>>(null);
  const canEdit = role === "OWNER" || role === "EDITOR";

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Start writing…",
      }),
      Typography,
      CharacterCount,
    ],
    content: doc.textContent ? `<p>${doc.textContent}</p>` : "",
    editable: canEdit,
    editorProps: {
      attributes: {
        class:
          "prose prose-neutral max-w-none focus:outline-none min-h-[60vh] text-[#0f0e0d]",
      },
    },
    onUpdate: () => {
      if (!canEdit) return;
      setSaveStatus("unsaved");

      // debounce autosave
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        triggerSave();
      }, AUTOSAVE_DELAY);
    },
  });

  const triggerSave = useCallback(async () => {
    if (!editor) return;
    setSaveStatus("saving");
    try {
      const textContent = editor.getText();
      // snapshot is empty number array for now — Yjs fills this in Phase 2
      await saveSnapshot(doc.id, [], textContent);
      setSaveStatus("saved");
    } catch {
      setSaveStatus("unsaved");
    }
  }, [editor, doc.id]);

  // save on cmd+s / ctrl+s
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        if (saveTimer.current) clearTimeout(saveTimer.current);
        triggerSave();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [triggerSave]);

  // save on tab close
  useEffect(() => {
    function onBeforeUnload(e: BeforeUnloadEvent) {
      if (saveStatus === "unsaved") {
        e.preventDefault();
      }
    }
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [saveStatus]);

  // cleanup timer
  useEffect(
    () => () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    },
    [],
  );

  return (
    <div className="h-screen flex flex-col bg-white">
      <EditorHeader
        docId={doc.id}
        title={title}
        role={role}
        members={members}
        saveStatus={saveStatus}
      />
      {canEdit && <EditorToolbar editor={editor} />}

      {/* editor area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-8 py-12">
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* footer bar */}
      <div className="border-t border-[#ddd8cd] px-8 py-2 flex items-center justify-between bg-white">
        <span className="text-xs text-[#8a8070]">
          {editor?.storage.characterCount.words() ?? 0} words ·{" "}
          {editor?.storage.characterCount.characters() ?? 0} characters
        </span>
        {!canEdit && (
          <span className="text-xs text-[#8a8070] italic">View only</span>
        )}
      </div>
    </div>
  );
}
