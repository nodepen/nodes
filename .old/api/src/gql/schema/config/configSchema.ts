import { gql } from 'apollo-server-express'

/**
 * Types related to getting the current grasshopper configuration & installed plugins.
 */
export const configSchema = gql`
  extend type Query {
    getInstalledComponents: [GrasshopperComponent]!
  }

  type GrasshopperComponent {
    guid: String!
    name: String!
    nickname: String!
    keywords: [String]!
    description: String!
    icon: String
    libraryName: String!
    category: String!
    subcategory: String!
    isObsolete: Boolean!
    isVariable: Boolean!
    inputs: [GrasshopperParameter]!
    outputs: [GrasshopperParameter]!
  }

  type GrasshopperParameter {
    name: String!
    nickname: String!
    description: String!
    type: String!
    isOptional: Boolean!
  }
`
