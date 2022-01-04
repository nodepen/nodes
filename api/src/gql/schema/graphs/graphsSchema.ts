import { gql } from 'apollo-server-express'

/**
 * Types related to saving, listing, and editing graph records and related assets.
 */
export const graphsSchema = gql`
  extend type Query {
    graph(graphId: String!): GraphManifest
    graphsByAuthor(author: String!): [GraphManifest]!
    graphsByPopularity: [GraphManifest]!
  }

  extend type Mutation {
    deleteGraph(graphId: String!): String!
    duplicateGraph(graphId: String!): String!
    renameGraph(graphId: String!, name: String!): GraphManifest
    scheduleSaveGraph(
      solutionId: String!
      graphId: String!
      graphJson: String!
      graphName: String
    ): String!
  }

  extend type Subscription {
    onSaveFinish(graphId: String!): SaveFinishMessage!
  }

  type GraphManifest {
    id: String!
    name: String!
    author: GraphManifestAuthor!
    files: GraphManifestFiles!
    stats: GraphManifestStats!
  }

  type GraphManifestAuthor {
    name: String!
  }

  type GraphManifestFiles {
    graphBinaries: String
    graphJson: String
    graphSolutionJson: String
    thumbnailImage: String
    thumbnailVideo: String
  }

  type GraphManifestStats {
    views: Int!
  }

  type SaveFinishMessage {
    graphId: String!
    graphBinariesUrl: String!
    solutionId: String!
  }
`
