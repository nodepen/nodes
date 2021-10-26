import {
  GraphQLBoolean,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql'
import { allowed } from '../../data/allowed'

const GrasshopperParameterType = new GraphQLObjectType({
  name: 'GrasshopperParameter',
  fields: {
    name: { type: GraphQLString },
    nickname: { type: GraphQLString },
    description: { type: GraphQLString },
    type: { type: GraphQLString },
    isOptional: { type: GraphQLBoolean },
  },
})

const GrasshopperComponentType = new GraphQLObjectType({
  name: 'GrasshopperComponent',
  fields: {
    guid: { type: GraphQLString },
    name: { type: GraphQLString },
    nickname: { type: GraphQLString },
    description: { type: GraphQLString },
    icon: { type: GraphQLString },
    libraryName: { type: GraphQLString },
    category: { type: GraphQLString },
    subcategory: { type: GraphQLString },
    isObsolete: { type: GraphQLBoolean },
    isVariable: { type: GraphQLBoolean },
    inputs: { type: GraphQLList(GrasshopperParameterType) },
    outputs: { type: GraphQLList(GrasshopperParameterType) },
  },
})

const queryType = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    getInstalledComponents: {
      type: GraphQLList(GrasshopperComponentType),
      resolve: () => allowed,
    },
  },
})

export const schema = new GraphQLSchema({
  query: queryType,
})
