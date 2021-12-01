import { gql } from 'apollo-server-express'

/**
 * Types related to saving, listing, and editing graph records and related assets.
 */
export const graphsSchema = gql`
  extend type Query {
    graph(graphId: String!): GrasshopperGraph
    graphsByAuthor(author: String!): [GrasshopperGraph]!
  }

  extend type Mutation {
    scheduleSaveGraph(graphId: String!, graphJson: String!): String!
  }

  type GrasshopperGraph {
    manifest: GrasshopperGraphManifest!
    files: GrasshopperGraphFiles!
  }

  type GrasshopperGraphManifest {
    id: String!
    name: String!
    author: String!
  }

  type GrasshopperGraphFiles {
    json: String
    gh: String
    thumbnailImage: String
    thumbnailVideo: String
  }
`
