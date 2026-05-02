// Called by the y-websocket server after each sync, not by the browser
import prisma from "@/app/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Simple shared secret — WS server sends this header
  const secret = req.headers.get("x-internal-secret")
  if (secret !== process.env.INTERNAL_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const { snapshot, textContent } = await req.json()

  await prisma.document.update({
    where: { id },
    data: {
      yjsSnapshot: Buffer.from(snapshot),
      textContent,
      updatedAt: new Date(),
    },
  })

  return new NextResponse(null, { status: 204 })
}