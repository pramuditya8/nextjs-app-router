import { db } from "@/lib/db";
import { linksTable } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const { id: paramsId } = await params;
  const reqToEditData = await db
    .select()
    .from(linksTable)
    .where(eq(linksTable.id, Number(paramsId)));

  if (reqToEditData[0].email !== body.email) {
    NextResponse.json({ data: { message: "Forbidden" } }, { status: 403 });
    return;
  }

  const data = await db
    .update(linksTable)
    .set({ ...body, updated_at: sql`NOW()` })
    .where(eq(linksTable.id, Number(paramsId)))
    .returning({ updatedId: linksTable.id });
  return NextResponse.json({ data }, { status: 200 });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const { id: paramsId } = await params;
  const reqToEditData = await db
    .select()
    .from(linksTable)
    .where(eq(linksTable.id, Number(paramsId)));

  if (reqToEditData[0].email !== body.email) {
    NextResponse.json({ data: { message: "Forbidden" } }, { status: 403 });
    return;
  }

  const data = await db
    .update(linksTable)
    .set({ deleted_at: sql`NOW()` })
    .where(eq(linksTable.id, Number(paramsId)))
    .returning({ deletedId: linksTable.id });
  return NextResponse.json({ data }, { status: 200 });
}
