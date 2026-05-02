import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";

import { auth } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { EditorShell } from "./_components/EditorShell";

type Props = { params: Promise<{ id: string }> };

export default async function EditorPage({ params }: Props) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");

  const membership = await prisma.documentMember.findUnique({
    where: { documentId_userId: { documentId: id, userId: session.user.id } },
    include: {
      document: {
        select: {
          id: true,
          title: true,
          textContent: true,
          updatedAt: true,
          members: {
            include: {
              user: { select: { id: true, name: true, image: true } },
            },
          },
        },
      },
    },
  });

  if (!membership) notFound();

  const { document: doc, role } = membership;

  return (
    <EditorShell
      doc={{
        id: doc.id,
        title: doc.title,
        textContent: doc.textContent ?? "",
        updatedAt: doc.updatedAt.toISOString(),
      }}
      role={role}
      user={{
        id: session.user.id,
        name: session.user.name,
        image: session.user.image ?? null,
      }}
      members={doc.members.map((m) => ({
        id: m.user.id,
        name: m.user.name,
        image: m.user.image ?? null,
        role: m.role,
      }))}
    />
  );
}
