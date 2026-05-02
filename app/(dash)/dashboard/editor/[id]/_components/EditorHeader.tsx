"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import Link from "next/link";
import { renameDocument } from "@/app/lib/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Check, Clock } from "lucide-react";

type Member = {
  id: string;
  name: string;
  image: string | null;
  role: "OWNER" | "EDITOR" | "VIEWER";
};

type SaveStatus = "saved" | "saving" | "unsaved";

type Props = {
  docId: string;
  title: string;
  role: "OWNER" | "EDITOR" | "VIEWER";
  members: Member[];
  saveStatus: SaveStatus;
};

export function EditorHeader({
  docId,
  title,
  role,
  members,
  saveStatus,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(title);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  const canEdit = role === "OWNER" || role === "EDITOR";

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  function handleRename() {
    if (value.trim() === title || !value.trim()) {
      setValue(title);
      setEditing(false);
      return;
    }
    startTransition(async () => {
      await renameDocument(docId, value.trim());
      setEditing(false);
    });
  }

  return (
    <header className="h-14 border-b border-[#ddd8cd] bg-white flex items-center justify-between px-4 gap-4 shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>

        {editing ? (
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleRename();
              if (e.key === "Escape") {
                setValue(title);
                setEditing(false);
              }
            }}
            className="text-sm font-medium bg-transparent border-b border-[#c8601a] outline-none text-[#0f0e0d] min-w-0 w-48"
          />
        ) : (
          <span
            className={`text-sm font-medium text-[#0f0e0d] truncate ${canEdit ? "cursor-pointer hover:text-[#c8601a] transition-colors" : ""}`}
            onClick={() => canEdit && setEditing(true)}
            title={canEdit ? "Click to rename" : undefined}
          >
            {isPending ? value : title}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#8a8070]">
          {saveStatus === "saving" && (
            <>
              <Clock className="h-3 w-3 animate-spin" /> Saving...
            </>
          )}
          {saveStatus === "saved" && (
            <>
              <Check className="h-3 w-3 text-green-500" /> Saved
            </>
          )}
          {saveStatus === "unsaved" && (
            <span className="text-[#c8601a]">Unsaved changes</span>
          )}
        </div>

        <Badge
          variant="secondary"
          className="text-xs capitalize hidden sm:flex"
        >
          {role.toLowerCase()}
        </Badge>

        <div className="flex -space-x-2">
          {members.slice(0, 4).map((m) => (
            <Avatar key={m.id} className="h-7 w-7 border-2 border-white">
              <AvatarImage src={m.image ?? undefined} />
              <AvatarFallback className="text-[10px] bg-[#f0d4bb] text-[#c8601a]">
                {m.name?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
          ))}
          {members.length > 4 && (
            <div className="h-7 w-7 rounded-full bg-[#ede9e0] border-2 border-white flex items-center justify-center text-[10px] font-medium text-[#8a8070]">
              +{members.length - 4}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
