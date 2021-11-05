import { makeExecutableSchema } from '@graphql-tools/schema'
import { baseSchema } from './base'
import { configSchema, configResolvers } from './config'
import { solutionSchema, solutionResolvers } from './solution'

const typeDefs = [baseSchema, configSchema, solutionSchema]

const { Query: configQueryType, ...configTypes } = configResolvers
const {
  Query: solutionQueryType,
  Mutation: solutionMutationType,
  Subscription: solutionSubscriptionType,
  ...solutionTypes
} = solutionResolvers

const resolvers = {
  Query: {
    ...configQueryType,
    ...solutionQueryType,
  },
  Mutation: {
    ...solutionMutationType,
  },
  Subscription: {
    ...solutionSubscriptionType,
  },
  ...configTypes,
  ...solutionTypes,
}

export const schema = makeExecutableSchema({ typeDefs, resolvers })
