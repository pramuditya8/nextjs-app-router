import {
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const linksTable = pgTable("links", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: text().notNull(),
  title: varchar({ length: 255 }).notNull(),
  url: text().notNull(),
  created_at: timestamp().defaultNow(),
  updated_at: timestamp().defaultNow(),
  deleted_at: timestamp(),
});
