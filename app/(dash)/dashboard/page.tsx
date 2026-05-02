import { redirect } from "next/navigation";
import { auth } from "../../lib/auth";
import prisma from "../../lib/prisma";
import { headers } from "next/headers";
import DashboardClient from "./_components/dashboard-client";
import type { MemberRole } from "@/app/generated/prisma";

const PER_PAGE = 6;

type SearchParams = Promise<{
  page?: string;
  filter?: string;
  search?: string;
}>;

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");

  const userId = session.user.id;
  const params = await searchParams;

  const page   = Math.max(1, parseInt(params.page   ?? "1") || 1);
  const search = params.search?.trim() ?? "";
  const filterParam = params.filter ?? "all";
  const filter = (["OWNER", "EDITOR", "VIEWER"].includes(filterParam)
    ? filterParam
    : "all") as "all" | MemberRole;

  /* ── where clause shared by query + count ── */
  const where = {
    userId,
    ...(filter !== "all" ? { role: filter } : {}),
    ...(search
      ? { document: { title: { contains: search, mode: "insensitive" as const } } }
      : {}),
  };

  const [membership, total, allStats] = await Promise.all([
    /* paginated docs */
    prisma.documentMember.findMany({
      where,
      include: {
        document: {
          select: {
            id: true,
            title: true,
            updatedAt: true,
            owner: { select: { id: true, name: true, image: true } },
          },
        },
      },
      orderBy: { document: { updatedAt: "desc" } },
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
    }),

    /* total matching (for pagination) */
    prisma.documentMember.count({ where }),

    /* sidebar stats — always over ALL user docs regardless of filter */
    prisma.documentMember.groupBy({
      by: ["role"],
      where: { userId },
      _count: { role: true },
    }),
  ]);

  const docs = membership.map((m) => ({
    ...m.document,
    updatedAt: m.document.updatedAt.toISOString(),
    role: m.role,
  }));

  const roleCount = Object.fromEntries(
    allStats.map((r) => [r.role, r._count.role])
  ) as Partial<Record<MemberRole, number>>;

  const totalAll = (roleCount.OWNER ?? 0) + (roleCount.EDITOR ?? 0) + (roleCount.VIEWER ?? 0);
  const stats = {
    total:  totalAll,
    owned:  roleCount.OWNER  ?? 0,
    shared: (roleCount.EDITOR ?? 0) + (roleCount.VIEWER ?? 0),
  };

  const user = {
    id:    session.user.id,
    name:  session.user.name,
    image: session.user.image ?? null,
    email: session.user.email ?? null,
  };

  return (
    <DashboardClient
      docs={docs}
      total={total}
      page={page}
      filter={filter}
      search={search}
      stats={stats}
      user={user}
    />
  );
}
