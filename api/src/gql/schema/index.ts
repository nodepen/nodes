import { makeExecutableSchema } from '@graphql-tools/schema'
import { baseSchema } from './base'
import { configSchema } from './config'
import { solutionSchema } from './solution'

export const typeDefs = [baseSchema, configSchema, solutionSchema]
