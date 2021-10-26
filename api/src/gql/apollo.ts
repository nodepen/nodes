import { ApolloServer, AuthenticationError } from 'apollo-server-express'
import { execute, subscribe } from 'graphql'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import { app, server } from './express'
import { authenticate } from './utils'
import { schema } from './schema'

/**
 * Attach the GraphQL server instances to the imported core server object.
 * @returns The modified core server object
 */
export const initialize = async () => {
  // Create the core apollo server
  const gqlQueryServer = new ApolloServer({
    schema,
    context: async ({ req, res }) => {
      const token = req.headers?.authorization

      const user: { id: string; name: string } = {
        id: undefined,
        name: undefined,
      }

      try {
        Object.assign(user, await authenticate(token))
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
  gqlQueryServer.applyMiddleware({ app: app as any })

  // Create and attach the additional subscription server
  const gqlSubscriptionServer = SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe: (...params) => {
        // const [_schema, _document, _root, context, variables, operation] =
        //   params

        // console.log(context)
        // console.log(variables)
        // console.log(operation)

        // TODO: Authorize `context.id` user for `operation` on `variables.graphId`

        return subscribe(...params)
      },
      onConnect: (params: { [key: string]: string }) => {
        const token = params?.authorization

        if (!token) {
          throw new Error('NodePen will not honor unauthenticated requests.')
        }

        return authenticate(token).then((user) => {
          console.log(`[ CONNECT ] ${user.id} (${user.name}) `)
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
