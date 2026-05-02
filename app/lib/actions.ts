"use server"

import { headers } from "next/headers";
import { MemberRole } from "../generated/prisma";
import { auth } from "./auth";
import prisma from "./prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const ROLE_RANK: Record<MemberRole,number> = {
    OWNER: 3,
    EDITOR: 2,
    VIEWER: 1
}


export async function getUser() {
    const session = await auth.api.getSession({headers: await headers()})

    if(!session?.user) redirect("/login")
    return session.user;
}


export async function requireDocRole(
    docId: string,
    userId:string,
    minimum: MemberRole="VIEWER") {

        const member = await prisma.documentMember.findUnique({
            where:{
                documentId_userId:{
                    documentId: docId,userId: userId
                }
            }
        })
        if (!member) throw new Error("Not found")

    if(ROLE_RANK[member.role] < ROLE_RANK[minimum]){
    throw new Error("Forbidden")
    }
    return member;

}

export async function createDocument() {
  const user = await getUser()

  const doc = await prisma.$transaction(async (tx) => {
    const document = await tx.document.create({
      data: { title: "Untitled", ownerId: user.id },
    })
    await tx.documentMember.create({
      data: { documentId: document.id, userId: user.id, role: "OWNER" },
    })
    return document
  })

  revalidatePath("/dashboard")
  return doc
}


export async function deleteDocument(docId: string) {
  const user = await getUser()
  await requireDocRole(docId, user.id, "OWNER")
  await prisma.document.delete({ where: { id: docId } })
  revalidatePath("/dashboard")
}


export async function renameDocument(docId: string, title: string) {
  const user = await getUser()
  await requireDocRole(docId, user.id, "EDITOR")

  const doc = await prisma.document.update({
    where: { id: docId },
    data: { title: title.trim() || "Untitled" },
  })

  revalidatePath("/dashboard")
  revalidatePath(`/dashboard/editor/${docId}`)
  return doc
}


export async function inviteMember(
  docId: string,
  email: string,
  role: "EDITOR" | "VIEWER" = "VIEWER"
) {
  const user = await getUser()
  await requireDocRole(docId, user.id, "OWNER")

  const invitee = await prisma.user.findUnique({ where: { email } })
  if (!invitee) throw new Error("User not found")

  await prisma.documentMember.upsert({
    where: { documentId_userId: { documentId: docId, userId: invitee.id } },
    update: { role },
    create: { documentId: docId, userId: invitee.id, role },
  })

  revalidatePath(`/dashboard/editor/${docId}`)
}

export async function removeMember(docId: string, memberId: string) {
  const user = await getUser()
  await requireDocRole(docId, user.id, "OWNER")

  if (memberId === user.id) throw new Error("Cannot remove yourself")

  await prisma.documentMember.delete({
    where: { documentId_userId: { documentId: docId, userId: memberId } },
  })

  revalidatePath(`/dashboard/editor/${docId}`)
}

export async function changeMemberRole(
  docId: string,
  memberId: string,
  role: "EDITOR" | "VIEWER"
) {
  const user = await getUser()
  await requireDocRole(docId, user.id, "OWNER")

  await prisma.documentMember.update({
    where: { documentId_userId: { documentId: docId, userId: memberId } },
    data: { role },
  })

  revalidatePath(`/dashboard/editor/${docId}`)
}


// SAVE YJS SNAPSHOT  (called by editor on autosave)
export async function saveSnapshot(
  docId: string,
  snapshot: number[],        // Uint8Array serialized as number[]
  textContent: string
) {
  const user = await getUser()
  await requireDocRole(docId, user.id, "EDITOR")

  await prisma.document.update({
    where: { id: docId },
    data: {
      yjsSnapshot: Buffer.from(snapshot),
      textContent,
      updatedAt: new Date(),
    },
  })
  // no revalidatePath — editor is real-time, not page-cache driven
}

// CREATE VERSION SNAPSHOT  (manual save point)
// -------------------------------------------------------
export async function createVersion(
  docId: string,
  snapshot: number[],
  label?: string
) {
  const user = await getUser()
  await requireDocRole(docId, user.id, "EDITOR")

  return await prisma.documentVersion.create({
    data: {
      documentId: docId,
      createdById: user.id,
      yjsSnapshot: Buffer.from(snapshot),
      label: label ?? null,
    },
  })
}