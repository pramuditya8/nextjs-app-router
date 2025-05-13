"use server";
import { db } from "@/lib/db";
import { linksTable } from "@/lib/db/schema";
import { and, desc, eq, isNull } from "drizzle-orm";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

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

  const data = await db
    .insert(linksTable)
    .values({ ...body })
    .returning({ insertedId: linksTable.id });
  return NextResponse.json({ data }, { status: 200 });
}
