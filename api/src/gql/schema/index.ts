import { makeExecutableSchema } from '@graphql-tools/schema'
import { baseSchema } from './base'
import { configSchema, configResolvers } from './config'
import { graphsSchema, graphsResolvers } from './graphs'
import { solutionSchema, solutionResolvers } from './solution'
import { usersSchema, usersResolvers } from './users'

const typeDefs = [
  baseSchema,
  configSchema,
  graphsSchema,
  solutionSchema,
  usersSchema,
]

const { Query: configQueryType, ...configTypes } = configResolvers
const {
  Query: graphsQueryType,
  Mutation: graphsMutationType,
  Subscription: graphsSubscriptionType,
} = graphsResolvers
const {
  Query: solutionQueryType,
  Mutation: solutionMutationType,
  Subscription: solutionSubscriptionType,
  ...solutionTypes
} = solutionResolvers
const { Query: usersQueryType } = usersResolvers

const resolvers = {
  Query: {
    ...configQueryType,
    ...graphsQueryType,
    ...solutionQueryType,
    ...usersQueryType,
  },
  Mutation: {
    ...graphsMutationType,
    ...solutionMutationType,
  },
  Subscription: {
    ...graphsSubscriptionType,
    ...solutionSubscriptionType,
  },
  ...configTypes,
  ...solutionTypes,
}

export const schema = makeExecutableSchema({ typeDefs, resolvers })
