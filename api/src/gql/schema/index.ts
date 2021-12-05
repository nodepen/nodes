import { makeExecutableSchema } from '@graphql-tools/schema'
import { baseSchema } from './base'
import { configSchema, configResolvers } from './config'
import { graphsSchema, graphsResolvers } from './graphs'
import { solutionSchema, solutionResolvers } from './solution'

const typeDefs = [baseSchema, configSchema, graphsSchema, solutionSchema]

const { Query: configQueryType, ...configTypes } = configResolvers
const { Query: graphsQueryType, Mutation: graphsMutationType } = graphsResolvers
const {
  Query: solutionQueryType,
  Mutation: solutionMutationType,
  Subscription: solutionSubscriptionType,
  ...solutionTypes
} = solutionResolvers

const resolvers = {
  Query: {
    ...configQueryType,
    ...graphsQueryType,
    ...solutionQueryType,
  },
  Mutation: {
    ...graphsMutationType,
    ...solutionMutationType,
  },
  Subscription: {
    ...solutionSubscriptionType,
  },
  ...configTypes,
  ...solutionTypes,
}

export const schema = makeExecutableSchema({ typeDefs, resolvers })
