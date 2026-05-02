// The WS server calls this on connection to verify
// the user actually has access before opening a sync channel
import { NextRequest, NextResponse } from "next/server"

import { headers } from "next/headers"
import { auth } from "@/app/lib/auth"
import prisma from "@/app/lib/prisma"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const doc = await prisma.document.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      yjsSnapshot: true,       // WS server needs this to seed the Yjs doc
      members: {
        where: { userId: session.user.id },
        select: { role: true },
      },
    },
  })

  if (!doc || doc.members.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.json({
    ...doc,
    yjsSnapshot: doc.yjsSnapshot
      ? Array.from(doc.yjsSnapshot)   // Buffer → number[] for JSON
      : null,
    role: doc.members[0].role,
  })
}