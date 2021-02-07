import { gql } from 'apollo-server'

export const schema = gql`
  type Query {
    getComputeConfiguration: [GrasshopperComponent]!
    getSession(id: String!): SessionManifest!
    getSessionCurrentGraph(sessionId: String!): String!
    getSolutionStatus(sessionId: String!, solutionId: String!): SolutionStatus
    getUser(id: String!): UserManifest!
  }

  type Mutation {
    newSolution(sessionId: String!, solutionId: String!, graph: String!): String
    setConfiguration(config: String): String
  }

  type UserManifest {
    graphs: [String]!
    session: String!
  }

  type SessionManifest {
    history: [String]!
    current: String
  }

  type SolutionStatus {
    status: String!
    started_at: String
    finished_at: String
  }

  type GrasshopperComponent {
    guid: String!
    name: String!
    nickname: String!
    description: String!
    icon: String
    libraryName: String!
    category: String!
    subcategory: String!
    isObsolete: Boolean!
    isVariable: Boolean!
    inputs: [GrasshopperComponentParameter]!
    outputs: [GrasshopperComponentParameter]!
  }

  type GrasshopperComponentParameter {
    name: String!
    nickname: String!
    description: String!
    type: String!
    isOptional: Boolean!
  }
`
