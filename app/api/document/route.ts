import { getUser } from "@/app/lib/doc-access";
import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

/* GET - /api/docs - get all with owners*/
export async function GET() {
    
    try{
        const user = await getUser();

        const memberships = await prisma.documentMember.findMany({
            where:{userId: user.id},
            include:{
                document:{
                    select:{
                        id: true,
                        title: true,
                        updatedAt: true,
                        owner:{
                            select:{
                                id: true,
                                name: true,
                                image: true
                            }
                        }
                    }
                }
            },
            orderBy: {document:{updatedAt:"desc"}}
        })

        const docs = memberships.map((m) =>({
            ...m.document,
            role: m.role
        }))
        return NextResponse.json(docs)
    }catch (err) {
    if (err instanceof NextResponse) return err
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

/*POST - /api/doc - create a new doc + ownership */
export async function POST() {
    try{
        const user = await getUser();
        const doc = await prisma.$transaction(async (tx) =>{
            const document = await tx.document.create({
                data: {title:"Untitled",ownerId: user.id}
            })

            await tx.documentMember.create({
                data:{
                    documentId: document.id,
                    userId: user.id,
                    role:"OWNER"
                }
            })
            return document;
        })
    }catch (err) {
    if (err instanceof NextResponse) return err
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}