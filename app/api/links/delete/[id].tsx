// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { db } from '@/lib/db'
import { linksTable } from '@/lib/db/schema'
import type { NextApiRequest, NextApiResponse } from 'next'
import { sql, eq } from 'drizzle-orm'
import { getToken } from 'next-auth/jwt'

type Response = {
  deletedId?: number
  message?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ data: Response[] }>,
) {
  if (req.method !== 'DELETE') {
    res.status(405).json({ data: [{ message: 'Method not allowed' }] })
    return
  }

  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  const reqToEditData = await db
    .select()
    .from(linksTable)
    .where(eq(linksTable.id, Number(req.query.id)))

  if (reqToEditData[0].email !== session?.email) {
    res.status(403).json({ data: [{ message: 'Forbidden' }] })
    return
  }

  const data = await db
    .update(linksTable)
    .set({ deleted_at: sql`NOW()` })
    .where(eq(linksTable.id, Number(req.query.id)))
    .returning({ deletedId: linksTable.id })

  res.status(200).json({ data })
}
