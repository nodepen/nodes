import { gql } from 'apollo-server-express'

/**
 * Types related to saving, listing, and editing graph records and related assets.
 */
export const graphsSchema = gql`
  extend type Query {
    graph(graphId: String!): GraphManifest
    graphsByAuthor(author: String!): [GraphManifest]!
  }

  extend type Mutation {
    scheduleSaveGraph(
      solutionId: String!
      graphId: String!
      graphJson: String!
    ): String!
  }

  type GraphManifest {
    id: String!
    name: String!
    author: UserReference!
    files: GraphManifestFiles!
  }

  type GraphManifestFiles {
    graphBinaries: String
    graphJson: String
    graphSolutionJson: String
    thumbnailImage: String
    thumbnailVideo: String
  }
`
