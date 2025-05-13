"use server";
import { db } from "@/lib/db";
import { linksTable } from "@/lib/db/schema";
import { and, desc, eq, isNull } from "drizzle-orm";
import { NextApiRequest } from "next";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const data = await db
    .select()
    .from(linksTable)
    .where(
      and(
        eq(linksTable.email, String(session?.email)),
        isNull(linksTable.deleted_at)
      )
    )
    .orderBy(desc(linksTable.updated_at));

  return NextResponse.json({ data }, { status: 200 });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  // console.log(session, "payload");

  // const payload = JSON.parse(req.body);
  const data = await db
    .insert(linksTable)
    // .values({ ...body })
    .values({ ...body })
    .returning({ insertedId: linksTable.id });
  return NextResponse.json({ data }, { status: 200 });
}
