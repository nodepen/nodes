import {
  ApolloServer,
  AuthenticationError,
  Config,
} from 'apollo-server-express'
import { schema as typeDefs } from './schema'
import { resolvers } from './resolvers'
import admin from 'firebase-admin'
import { origins } from './origins'
import { execute, subscribe } from 'graphql'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import { server } from '../express'

const schema = makeExecutableSchema({ typeDefs, resolvers })

export const gqlQueryServer = new ApolloServer({
  schema,
  // cors: {
  //   origin: origins,
  //   credentials: true,
  //   allowedHeaders: '*',
  // },
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

const gqlSubscriptionServer = SubscriptionServer.create(
  {
    schema,
    execute,
    subscribe,
  },
  {
    server,
    path: gqlQueryServer.graphqlPath,
  }
)

const SIGNALS = ['SIGINT', 'SIGTERM']

SIGNALS.forEach((signal) => {
  process.on(signal, () => gqlSubscriptionServer.close)
})

export { server }
