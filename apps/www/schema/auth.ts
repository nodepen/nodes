import {
  boolean,
  timestamp,
  text,
  primaryKey,
  integer,
  pgSchema,
} from "drizzle-orm/pg-core"
import type { AdapterAccount } from "next-auth/adapters"
import cryptoRandomString from "crypto-random-string"

export const authSchema = pgSchema("auth")

export const users = authSchema.table("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => cryptoRandomString({ length: 9 })),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
})

export const accounts = authSchema.table(
  "accounts",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount['type']>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    primaryKey({
      columns: [account.provider, account.providerAccountId],
    })
  ],
)

export const sessions = authSchema.table("sessions", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})

export const verificationTokens = authSchema.table(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => [
    primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    })
  ]
)

export const speckleTokens = authSchema.table(
  "speckle_tokens",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" })
      .primaryKey(),
    token: text("token").notNull(),
    refreshToken: text("refresh_token").notNull()
  }
)

export const authenticators = authSchema.table(
  "authenticators",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => [
    primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    })
  ]
)