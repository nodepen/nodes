import { pgSchema, primaryKey, text } from "drizzle-orm/pg-core";
import { users } from "./auth";


export const speckleSchema = pgSchema("speckle")

// Speckle projects are scoped to a single nodepen user
export const projects = speckleSchema.table(
  "projects",
  {
    project_id: text("project_id").primaryKey(),
    user_id: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" })
  }
)

// Speckle models are scoped to a single nodepen document
export const models = speckleSchema.table(
  "models",
  {
    model_id: text("model_id").primaryKey(),
    project_id: text("project_id").references(() => projects.project_id, { onDelete: "set null" }),
    user_id: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" })
  }
)

