import { integer, pgEnum, pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";
import { uniqueNamesGenerator, adjectives, animals } from 'unique-names-generator'
import { users } from "./auth";
import cryptoRandomString from "crypto-random-string";
import { relations } from "drizzle-orm";

export const documentLanguage = pgEnum("document_language", ["gh", "ghz"])

export const documents = pgTable("documents", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => cryptoRandomString({ length: 9, type: 'alphanumeric' })),
  name: text("name")
    .notNull()
    .$defaultFn(() => uniqueNamesGenerator({
      dictionaries: [adjectives, animals],
      length: 2,
      separator: ' ',
      style: 'capital'
    }))
    .$default(() => "My Document"),
  language: documentLanguage("language").notNull().default("gh"),
  authorId: text("author_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  revision: integer("revision")
    .notNull()
    .default(1),
  createdAt: timestamp("created_at", { precision: 3 }).notNull().$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at", { precision: 3 }).notNull().$defaultFn(() => new Date()),
  rootModelId: text("root_model_id").notNull(),
  documentModelId: text("document_model_id").notNull(),
  outputModelId: text("output_model_id").notNull()
})

export const documentLinks = pgTable("document_links", {
  documentId: text("document_id").notNull().references(() => documents.id, { onDelete: "cascade" }),
  modelId: text("model_id").notNull()
}, (link) => [
  primaryKey({
    columns: [link.documentId, link.modelId],
  })
])

export const documentRelations = relations(documents, ({ one, many }) => ({
  author: one(users, {
    fields: [documents.authorId],
    references: [users.id],
    relationName: "document_author"
  }),
  links: many(documentLinks, {
    relationName: "document_links_document"
  })
}))

export const documentLinkRelations = relations(documentLinks, ({ one }) => ({
  document: one(documents, {
    fields: [documentLinks.documentId],
    references: [documents.id],
    relationName: "document_links_document"
  })
}))
