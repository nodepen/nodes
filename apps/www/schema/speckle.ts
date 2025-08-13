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

