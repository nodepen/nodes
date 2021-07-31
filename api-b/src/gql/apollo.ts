import { ApolloServer, AuthenticationError, Config } from 'apollo-server'
import { schema as typeDefs } from './schema'
import { resolvers } from './resolvers'
import admin from 'firebase-admin'
import { origins } from './origins'
import { pubsub } from './pubsub'

const myPlugin: Config['plugins'] = [
  {
    // Fires whenever a GraphQL request is received from a client.
    async requestDidStart(requestContext: any) {
      setTimeout(() => {
        console.log('EMIT')
        pubsub.publish('SOLUTION_COMPLETE', {
          onSolution: { solutionId: '123' },
        })
      }, 500)
      console.log('Request started! Query:\n' + requestContext.request.query)

      return {
        // Fires whenever Apollo Server will parse a GraphQL
        // request to create its associated document AST.
        async parsingDidStart(requestContext: any) {
          // console.log('Parsing started!')
        },

        // Fires whenever Apollo Server will validate a
        // request's document AST against your GraphQL schema.
        async validationDidStart(requestContext: any) {
          // console.log('Validation started!')
        },
      } as any
    },
  } as any,
]

export const api = new ApolloServer({
  typeDefs,
  resolvers,
  cors: {
    origin: origins,
    credentials: true,
    allowedHeaders: '*',
  },
  plugins: myPlugin,
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
