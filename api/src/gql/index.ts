import { buildSchema } from 'graphql'
import { importSchema } from 'graphql-import'
import { graphqlHTTP } from 'express-graphql'
import { resolvers } from './resolvers'

const schema = buildSchema(importSchema('**/*.gql'))

export const gql = graphqlHTTP({
  schema,
  rootValue: resolvers,
  graphiql: true,
})
