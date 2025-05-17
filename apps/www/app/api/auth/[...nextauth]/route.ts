// export const dynamic = 'force-dynamic'

import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Speckle",
      credentials: {
        accessCode: { label: "Access Code", type: "text" },
      },
      async authorize(credentials, req) {
        // Grab access code from credentials

        // Exchange for token

        // Get user info from token

        // Upsert user to users db

        const user = {
          id: '',
          name: '',
          avatar: '',
          // These live in a related table
          speckleToken: '',
          speckleRefreshToken: ''
        }

        // Return user to jwt
        // Requests can use speckle token on jwt (?)

        return {
          id: '',
          name: '',
          email: '',
          image: ''
        }
      }
    })
  ]
})

export { handler as GET, handler as POST }