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

  extend type Subscription {
    onSaveFinish(graphId: String!): SaveFinishMessage!
  }

  type GraphManifest {
    id: String!
    name: String!
    author: GraphManifestAuthor!
    files: GraphManifestFiles!
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

  type SaveFinishMessage {
    graphId: String!
    solutionId: String!
  }
`
