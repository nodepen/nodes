import { integer, jsonb, pgTable, text } from "drizzle-orm/pg-core";
import { users } from "./auth";
import { models } from "./speckle";
import cryptoRandomString from "crypto-random-string";
import { relations } from "drizzle-orm";

export const documents = pgTable("documents", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => cryptoRandomString({ length: 9 })),
  authorId: text("author_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  modelId: text("model_id")
    .notNull()
    .references(() => models.modelId, { onDelete: "cascade" }),
  document: jsonb("document")
    .notNull(),
  revision: integer("revision")
    .notNull()
    .default(1)
})

export const documentsRelations = relations(documents, ({ one }) => ({
  model: one(models, {
    fields: [documents.modelId],
    references: [models.modelId]
  })
}))