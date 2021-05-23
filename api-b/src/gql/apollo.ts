import { ApolloServer, AuthenticationError } from 'apollo-server'
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
  },
  context: async ({ req, res }) => {
    const crumbs = (req.headers?.cookie ?? '')
      .split('; ')
      .reduce((all, current) => {
        const [key, value] = current.split('=')

        all[key] = value

        return all
      }, {} as { [key: string]: string })

    const token = crumbs?.token

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
        'NodePen will no honor unauthenticated request.'
      )
    }

    return { user }
  },
})
