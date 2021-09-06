import {
  ApolloServer,
  AuthenticationError,
  Config,
} from 'apollo-server-express'
import { schema as typeDefs } from './schema'
import { resolvers } from './resolvers'
import admin from 'firebase-admin'
// import origins from '../auth/origins.json'
import { execute, subscribe } from 'graphql'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import { app, server } from '../express'

type UserRecord = {
  id: string
  name: string
}

const authorize = async (token: string): Promise<UserRecord> => {
  const session = await admin.auth().verifyIdToken(token)
  const user = await admin.auth().getUser(session.uid)

  return {
    id: user.uid,
    name: user.displayName ?? 'anonymous',
  }
}

export const initialize = async () => {
  const schema = makeExecutableSchema({ typeDefs, resolvers })

  const gqlQueryServer = new ApolloServer({
    schema,
    context: async ({ req, res }) => {
      const token = req.headers?.authorization

      const user: { id: string; name: string } = {
        id: undefined,
        name: undefined,
      }

      try {
        Object.assign(user, await authorize(token))
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

  await gqlQueryServer.start()
  console.log('gql server started')
  gqlQueryServer.applyMiddleware({ app: app as any })

  const gqlSubscriptionServer = SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
      onConnect: (params: { [key: string]: string }) => {
        const token = params?.authorization

        if (!token) {
          throw new Error('NodePen will not honor unauthenticated requests.')
        }

        return authorize(token).then((user) => {
          return user
        })
      },
    },
    {
      server,
      path: gqlQueryServer.graphqlPath,
    }
  )

  const SIGNALS = ['SIGINT', 'SIGTERM']

  SIGNALS.forEach((signal) => {
    process.on(signal, () => gqlSubscriptionServer.close())
  })

  return { server }
}
