import { headers } from "next/headers";
import { auth } from "./auth";
import { NextResponse } from "next/server";

export async function getUser() {
    const session = await auth.api.getSession({headers: await headers()})

    if(!session?.user){
        throw NextResponse.json({error:"Unauthorized..."},{status:401})
    }
    return session.user;
}
