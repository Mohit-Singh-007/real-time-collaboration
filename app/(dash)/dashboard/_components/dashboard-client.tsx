"use client";

import { createDocument, deleteDocument } from "@/app/lib/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  FilePlus, FileText, Files, Share2, Clock,
  Search, LayoutGrid, List, ChevronLeft, ChevronRight, PenSquare,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition, useEffect } from "react";
import { DocCard, type Doc } from "./DocCard";
import { DeleteDialog } from "./DeleteDialog";

type FilterTab = "all" | "OWNER" | "EDITOR" | "VIEWER";
type ViewMode  = "grid" | "list";

const PER_PAGE = 6;

const NAV: { label: string; icon: React.ElementType; filter: FilterTab }[] = [
  { label: "All Documents", icon: Files,    filter: "all"    },
  { label: "My Documents",  icon: FileText,  filter: "OWNER"  },
  { label: "Shared",        icon: Share2,    filter: "EDITOR" },
  { label: "View-only",     icon: Clock,     filter: "VIEWER" },
];

type Props = {
  docs: Doc[];
  total: number;
  page: number;
  filter: FilterTab;
  search: string;
  stats: { total: number; owned: number; shared: number };
  user: { id: string; name: string; image?: string | null; email?: string | null };
};

export default function DashboardClient({
  docs: initial, total, page: curPage, filter: curFilter,
  search: curSearch, stats, user,
}: Props) {
  const router = useRouter();

  // optimistic docs list (reset when server sends new data)
  const [docs, setDocs] = useState(initial);
  useEffect(() => setDocs(initial), [initial]);

  const [isCreating, startCreate]  = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Doc | null>(null);
  const [search, setSearch] = useState(curSearch);
  const [view, setView]     = useState<ViewMode>("grid");

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  /* ── URL helpers ── */
  function buildUrl(overrides: Partial<{ page: number; filter: FilterTab; search: string }>) {
    const p = new URLSearchParams();
    const s = overrides.search  ?? curSearch;
    const f = overrides.filter  ?? curFilter;
    const pg = overrides.page   ?? curPage;
    if (s)          p.set("search", s);
    if (f !== "all") p.set("filter", f);
    if (pg > 1)     p.set("page", String(pg));
    return `/dashboard?${p.toString()}`;
  }

  function goFilter(f: FilterTab) { router.push(buildUrl({ filter: f, page: 1 })); }
  function goPage(pg: number)     { router.push(buildUrl({ page: pg })); }

  /* debounce search → URL */
  useEffect(() => {
    const t = setTimeout(() => {
      if (search !== curSearch) router.push(buildUrl({ search, page: 1 }));
    }, 800);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  /* ── actions ── */
  function handleCreate() {
    startCreate(async () => {
      const doc = await createDocument();
      router.push(`/dashboard/editor/${doc.id}`);
    });
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await deleteDocument(id);
      setDocs((prev) => prev.filter((d) => d.id !== id));
    } finally {
      setDeletingId(null);
    }
  }

  /* ── render ── */
  return (
    <div className="flex h-screen bg-background overflow-hidden">

      {/* ══ SIDEBAR ══ */}
      <aside className="w-56 shrink-0 flex flex-col border-r border-border bg-sidebar">
        {/* logo */}
        <div className="h-14 flex items-center gap-2.5 px-4 border-b border-sidebar-border shrink-0">
          <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
            <PenSquare className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-sidebar-foreground">Collab</span>
        </div>

        {/* new doc */}
        <div className="px-3 py-4 shrink-0">
          <Button onClick={handleCreate} disabled={isCreating} className="w-full justify-start gap-2">
            <FilePlus className="h-4 w-4" />
            {isCreating ? "Creating…" : "New document"}
          </Button>
        </div>

        {/* nav */}
        <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto">
          {NAV.map(({ label, icon: Icon, filter: f }) => (
            <button
              key={label}
              onClick={() => goFilter(f)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors text-left ${
                curFilter === f
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </button>
          ))}
        </nav>

        {/* stats */}
        <div className="px-4 py-3 border-t border-sidebar-border shrink-0">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">Overview</p>
          {[["Total", stats.total], ["Owned", stats.owned], ["Shared", stats.shared]].map(([label, val]) => (
            <div key={String(label)} className="flex justify-between text-xs py-0.5">
              <span className="text-muted-foreground">{label}</span>
              <span className="font-medium text-sidebar-foreground">{val}</span>
            </div>
          ))}
        </div>

        {/* user */}
        <div className="px-4 py-3 border-t border-sidebar-border shrink-0">
          <div className="flex items-center gap-2.5">
            <Avatar className="h-7 w-7 shrink-0">
              <AvatarImage src={user?.image ?? undefined} />
              <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                {user?.name?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.name}</p>
              {user?.email && <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>}
            </div>
          </div>
        </div>
      </aside>

      {/* ══ MAIN ══ */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* top bar */}
        <header className="h-14 border-b border-border flex items-center gap-3 px-6 shrink-0">
          <h1 className="text-base font-semibold text-foreground shrink-0">
            {NAV.find((n) => n.filter === curFilter)?.label ?? "Documents"}
          </h1>
          <div className="flex-1" />
          <div className="relative w-56">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search…"
              className="w-full pl-8 pr-3 py-1.5 text-sm rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 transition"
            />
          </div>
          <div className="flex border border-border rounded-md overflow-hidden">
            {([["grid", LayoutGrid], ["list", List]] as const).map(([v, Icon]) => (
              <button
                key={v}
                onClick={() => setView(v)}
                aria-label={`${v} view`}
                className={`p-1.5 transition-colors ${view === v ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent/50"}`}
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>
        </header>

        {/* filter pills */}
        <div className="px-6 pt-3 pb-2 flex items-center gap-1.5 shrink-0 flex-wrap">
          {(["all", "OWNER", "EDITOR", "VIEWER"] as const).map((f) => {
            const count = f === "all" ? stats.total
              : f === "OWNER" ? stats.owned
              : f === "EDITOR" ? stats.total - stats.owned - (stats.total - stats.owned - (stats.total - stats.owned))
              : 0; // approximate — server has exact
            return (
              <button
                key={f}
                onClick={() => goFilter(f)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  curFilter === f
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {f === "all" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
              </button>
            );
          })}
          <span className="ml-auto text-xs text-muted-foreground">
            {total} doc{total !== 1 ? "s" : ""}
          </span>
        </div>

        {/* docs */}
        <div className="flex-1 overflow-y-auto px-6 pb-4">
          {docs.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
                <FileText className="h-7 w-7 text-muted-foreground" />
              </div>
              <p className="font-medium mb-1">No documents found</p>
              <p className="text-sm text-muted-foreground mb-4">
                {curSearch ? "Try a different search term." : "Create your first document to get started."}
              </p>
              {!curSearch && (
                <Button onClick={handleCreate} disabled={isCreating} size="sm">
                  <FilePlus className="h-4 w-4 mr-2" /> New document
                </Button>
              )}
            </div>
          )}

          {docs.length > 0 && view === "grid" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
              {docs.map((doc) => (
                <DocCard key={doc.id} doc={doc} view="grid"
                  isDeleting={deletingId === doc.id}
                  onOpen={() => router.push(`/dashboard/editor/${doc.id}`)}
                  onDeleteRequest={() => setDeleteTarget(doc)}
                />
              ))}
            </div>
          )}

          {docs.length > 0 && view === "list" && (
            <div className="space-y-1.5 pt-1">
              {docs.map((doc) => (
                <DocCard key={doc.id} doc={doc} view="list"
                  isDeleting={deletingId === doc.id}
                  onOpen={() => router.push(`/dashboard/editor/${doc.id}`)}
                  onDeleteRequest={() => setDeleteTarget(doc)}
                />
              ))}
            </div>
          )}
        </div>

        {/* pagination */}
        {totalPages > 1 && (
          <div className="border-t border-border px-6 py-3 flex items-center justify-between shrink-0">
            <p className="text-xs text-muted-foreground">
              Page {curPage} of {totalPages} · {total} total
            </p>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-7 w-7"
                onClick={() => goPage(curPage - 1)} disabled={curPage === 1}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => goPage(p)}
                  className={`h-7 w-7 rounded-md text-xs font-medium transition-colors ${
                    p === curPage
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  {p}
                </button>
              ))}
              <Button variant="ghost" size="icon" className="h-7 w-7"
                onClick={() => goPage(curPage + 1)} disabled={curPage === totalPages}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* ══ DELETE DIALOG ══ */}
      <DeleteDialog
        doc={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (deleteTarget) await handleDelete(deleteTarget.id);
        }}
      />
    </div>
  );
}
