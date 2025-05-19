import { NextAuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import { getEnv } from "@/utils/env"
import { getActiveUser } from "@/sdk/auth/auth";
import { getDb } from '@/schema/db'
import { speckleTokens, users } from "@/schema/auth";

export const config = {
  callbacks: {
    async jwt({ token, user }) {
      console.log({ token })
      console.log({ user })
      token.id = (user as any)?.id
      token.speckleToken = (user as any)?.speckleToken
      return token
    },
    async session({ session, token }) {
      if (!session.user) {
        return session
      }

      if (token.id && token.speckleToken) {
        console.log('Adding auth info to user!')
        Object.assign(session.user, {
          id: token.id,
          speckleToken: token.speckleToken
        })
      }

      return session
    }
  },
  session: {
    strategy: 'jwt'
  },
  secret: process.env.AUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Speckle",
      credentials: {
        accessCode: { label: "Access Code", type: "text" },
      },
      async authorize(credentials, req) {
        const env = getEnv()
        const db = await getDb()

        // Grab access code from credentials
        const { accessCode } = credentials ?? {}

        if (!accessCode) {
          console.log('wtf')
          return null
        }

        // Exchange for token
        const res = await fetch(`${env.SPECKLE_SERVER_URL}/auth/token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            accessCode: accessCode,
            appId: env.SPECKLE_APP_ID,
            appSecret: env.SPECKLE_APP_SECRET,
            challenge: env.SPECKLE_APP_CHALLENGE
          })
        })

        const { token, refreshToken } = await res.json()

        if (!token) {
          console.log('Hmmm')
          return null
        }

        // Get user info from token
        const activeUser = await getActiveUser({
          speckleToken: token,
          speckleServerUrl: env.SPECKLE_SERVER_URL
        })()

        console.log({ activeUser })

        // Upsert user to users db & speckle tokens
        try {
          await db.insert(users).values({
            id: activeUser.id,
            name: activeUser.name,
            email: activeUser.email,
            emailVerified: new Date(),
            image: activeUser.avatar ?? null
          }).onConflictDoUpdate({
            target: [users.id],
            set: {
              name: activeUser.name,
              email: activeUser.email,
              image: activeUser.avatar
            }
          })

          await db.insert(speckleTokens).values({
            userId: activeUser.id,
            token,
            refreshToken
          }).onConflictDoUpdate({
            target: [speckleTokens.userId],
            set: {
              token,
              refreshToken
            }
          })
        } catch (e) {
          console.log(e)
        }


        const user = {
          id: activeUser.id,
          name: activeUser.name,
          email: activeUser.email,
          image: '',
          // These live in a related table
          speckleToken: token,
          speckleRefreshToken: refreshToken
        }

        // Return user to jwt
        // Requests can use speckle token on jwt (?)

        return user
      }
    })
  ]
} satisfies NextAuthOptions