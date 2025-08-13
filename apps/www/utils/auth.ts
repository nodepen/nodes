import { speckleTokens } from "@/schema/auth";
import { getDb } from "@/schema/db";
import { SpeckleRequestContext } from "@/sdk/types";
import { eq } from "drizzle-orm";
import { JWT, getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { getEnv } from "./env";

export const getSpeckleToken = async (jwt: JWT) => {
  const { sub } = jwt

  if (!sub) {
    return null
  }

  const db = await getDb()

  const res = await db.query.speckleTokens.findFirst({
    where: eq(speckleTokens.userId, sub)
  })

  return res?.token ?? null
}

export const getSpeckleUserId = async (req: NextRequest): Promise<string | null> => {
  const env = getEnv()

  const jwt = await getToken({ req, secret: env.AUTH_SECRET })

  if (!jwt) {
    return null
  }

  return jwt.sub ?? null
}

export const getSpeckleRequestContext = async (req: NextRequest): Promise<SpeckleRequestContext & { speckleUserId: string } | null> => {
  const env = getEnv()

  const jwt = await getToken({ req, secret: env.AUTH_SECRET })

  if (!jwt || !jwt.sub) {
    return null
  }

  const speckleToken = await getSpeckleToken(jwt)

  if (!speckleToken) {
    return null
  }

  return {
    speckleUserId: jwt.sub,
    speckleToken,
    speckleServerUrl: env.SPECKLE_SERVER_URL
  }
}

export const getSpeckleWorkspaceAdminRequestContext = (): SpeckleRequestContext => {
  const env = getEnv()

  return {
    speckleToken: env.SPECKLE_WORKSPACE_ADMIN_TOKEN,
    speckleServerUrl: env.SPECKLE_SERVER_URL
  }
}