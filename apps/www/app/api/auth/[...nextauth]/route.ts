// export const dynamic = 'force-dynamic'

import NextAuth from "next-auth"
import { config } from "./utils"

const handler = NextAuth(config)

export { handler as GET, handler as POST }