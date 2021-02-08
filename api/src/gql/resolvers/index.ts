import { Query } from './Query'
import { Mutation } from './Mutation'
import { Types } from './Types'

export const resolvers = { Query, Mutation, ...Types }
