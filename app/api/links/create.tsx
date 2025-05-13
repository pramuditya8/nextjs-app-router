// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { db } from "@/lib/db";
import { linksTable } from "@/lib/db/schema";
import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

type Response = {
  insertedId?: number;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ data: Response[] }>
) {
  if (req.method !== "POST") {
    res.status(405).json({ data: [{ message: "Method not allowed" }] });
  }

  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const payload = JSON.parse(req.body);

  const data = await db
    .insert(linksTable)
    .values({ ...payload, email: session?.email })
    .returning({ insertedId: linksTable.id });
  res.status(200).json({ data });
}
