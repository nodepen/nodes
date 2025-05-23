import { pgSchema, text } from "drizzle-orm/pg-core";
import { users } from "./auth";


export const speckleSchema = pgSchema("speckle")

// Speckle projects are scoped to a single nodepen user
export const projects = speckleSchema.table(
  "projects",
  {
    projectId: text("project_id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" })
  }
)

// Speckle models are scoped to a single nodepen document
export const models = speckleSchema.table(
  "models",
  {
    modelId: text("model_id").primaryKey(),
    projectId: text("project_id").references(() => projects.projectId, { onDelete: "set null" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" })
  }
)

