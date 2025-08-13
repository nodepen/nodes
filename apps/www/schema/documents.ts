import { integer, jsonb, pgTable, text } from "drizzle-orm/pg-core";
import { users } from "./auth";
import cryptoRandomString from "crypto-random-string";

export const documents = pgTable("documents", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => cryptoRandomString({ length: 9 })),
  authorId: text("author_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  rootModelId: text("root_model_id")
    .notNull(),
  linkedModelId: text("linked_model_id"),
  document: jsonb("document")
    .notNull(),
  revision: integer("revision")
    .notNull()
    .default(1)
})
