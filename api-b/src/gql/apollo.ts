import { ApolloServer, AuthenticationError, Config } from 'apollo-server'
import { schema as typeDefs } from './schema'
import { resolvers } from './resolvers'
import admin from 'firebase-admin'
import { origins } from './origins'

export const api = new ApolloServer({
  typeDefs,
  resolvers,
  cors: {
    origin: origins,
    credentials: true,
    allowedHeaders: '*',
  },
  context: async ({ req, res }) => {
    const token = req.headers?.authorization

    const user: { id: string; name: string } = {
      id: undefined,
      name: undefined,
    }

    try {
      const session = await admin.auth().verifyIdToken(token)

      const userRecord = await admin.auth().getUser(session.uid)

      user.id = userRecord.uid
      user.name = userRecord?.displayName ?? 'anonymous'
    } catch (e) {
      // Reject all unauthorized requests
      console.log(e)
    }

    if (!user.id) {
      throw new AuthenticationError(
        'NodePen will not honor unauthenticated requests.'
      )
    }

    return { user }
  },
})
