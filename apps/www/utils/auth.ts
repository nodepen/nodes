import { speckleTokens } from "@/schema/auth";
import { getDb } from "@/schema/db";
import { SpeckleRequestContext } from "@/sdk/types";
import { eq } from "drizzle-orm";
import { JWT, decode, getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { getEnv } from "./env";
import { cookies } from "next/headers";

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

export const getTokenFromCookies = async (cookies: { name: string, value: string }[]): Promise<JWT> => {
  const env = getEnv()

  const chunks: Record<string, string> = {}

  for (const cookie of cookies) {
    if (cookie.name.startsWith("next-auth.session-token")) {
      chunks[cookie.name] = cookie.value
    }
  }

  const sortedKeys = Object.keys(chunks).sort((a, b) => {
    const aSuffix = parseInt(a.split(".").pop() ?? "0")
    const bSuffix = parseInt(b.split(".").pop() ?? "0")

    return aSuffix - bSuffix
  })

  const encodedToken = sortedKeys.map((key) => chunks[key]).join("")

  const jwt = await decode({ token: encodedToken, secret: env.AUTH_SECRET })

  if (!jwt) {
    throw new Error('Could find JWT')
  }

  return jwt
}

export const getSpeckleRequestContextFromCookies = async (cookies: { name: string, value: string }[]): Promise<SpeckleRequestContext & { speckleUserId: string }> => {
  const env = getEnv()
  const jwt = await getTokenFromCookies(cookies)

  const db = await getDb()
  const userId = jwt.sub ?? ""

  const token = await db.query.speckleTokens.findFirst({
    where: eq(speckleTokens.userId, userId)
  })

  if (!token) {
    throw new Error('Failed to auth from cookies')
  }

  return {
    speckleServerUrl: env.SPECKLE_SERVER_URL,
    speckleToken: token.token,
    speckleUserId: userId
  }
}