import { pgTable, text } from "drizzle-orm/pg-core";
import { users } from "./auth";
import { models } from "./speckle";
import cryptoRandomString from "crypto-random-string";

export const documents = pgTable("documents", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => cryptoRandomString({ length: 9 })),
  author_id: text("author_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  model_id: text("model_id")
    .notNull()
    .references(() => models.model_id, { onDelete: "cascade" })
})