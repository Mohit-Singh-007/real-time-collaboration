"use client";

import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileText, MoreHorizontal, Trash2, Pencil } from "lucide-react";

export type Doc = {
  id: string;
  title: string;
  role: "OWNER" | "EDITOR" | "VIEWER";
  owner: { id: string; name: string; image: string | null };
  updatedAt: string;
};

const ROLE_STYLE: Record<Doc["role"], string> = {
  OWNER:  "bg-[#f0d4bb] text-[#c8601a]",
  EDITOR: "bg-blue-100 text-blue-700",
  VIEWER: "bg-muted text-muted-foreground",
};

type CardProps = {
  doc: Doc;
  isDeleting: boolean;
  onOpen: () => void;
  onDeleteRequest: () => void;
  view: "grid" | "list";
};

function DocMenu({ doc, onOpen, onDeleteRequest }: Pick<CardProps, "doc" | "onOpen" | "onDeleteRequest">) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onOpen(); }}>
          <Pencil className="h-4 w-4 mr-2" /> Open
        </DropdownMenuItem>
        {doc.role === "OWNER" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive focus:bg-destructive/10"
              onClick={(e) => { e.stopPropagation(); onDeleteRequest(); }}
            >
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function DocCard({ doc, isDeleting, onOpen, onDeleteRequest, view }: CardProps) {
  const timeAgo = formatDistanceToNow(new Date(doc.updatedAt), { addSuffix: true });
  const opacity = isDeleting ? "opacity-40 pointer-events-none" : "";

  if (view === "list") {
    return (
      <div
        className={`group flex items-center gap-3 px-4 py-3 rounded-lg border border-border bg-card hover:bg-accent/40 transition-colors cursor-pointer ${opacity}`}
        onClick={onOpen}
      >
        <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
          <FileText className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{doc.title || "Untitled"}</p>
          <p className="text-xs text-muted-foreground">{timeAgo}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Avatar className="h-5 w-5">
            <AvatarImage src={doc.owner.image ?? undefined} />
            <AvatarFallback className="text-[8px] bg-primary/10 text-primary">
              {doc.owner.name?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize ${ROLE_STYLE[doc.role]}`}>
            {doc.role.toLowerCase()}
          </span>
          <DocMenu doc={doc} onOpen={onOpen} onDeleteRequest={onDeleteRequest} />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`group relative flex flex-col rounded-xl border border-border bg-card hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer overflow-hidden ${opacity}`}
      onClick={onOpen}
    >
      <div className="h-24 bg-gradient-to-br from-accent/50 to-muted/50 flex items-center justify-center border-b border-border">
        <FileText className="h-9 w-9 text-muted-foreground/30" />
      </div>
      <div className="p-4 flex-1 flex flex-col gap-3">
        <p className="text-sm font-medium text-foreground truncate">{doc.title || "Untitled"}</p>
        <div className="flex items-center gap-2">
          <Avatar className="h-5 w-5">
            <AvatarImage src={doc.owner.image ?? undefined} />
            <AvatarFallback className="text-[8px] bg-primary/10 text-primary">
              {doc.owner.name?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground truncate flex-1">{doc.owner.name}</span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize shrink-0 ${ROLE_STYLE[doc.role]}`}>
            {doc.role.toLowerCase()}
          </span>
        </div>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-[11px] text-muted-foreground">{timeAgo}</span>
          <DocMenu doc={doc} onOpen={onOpen} onDeleteRequest={onDeleteRequest} />
        </div>
      </div>
    </div>
  );
}
