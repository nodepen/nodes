import { gql } from 'apollo-server-express'

/**
 * Types related to scheduling and reading solution results.
 */
export const solutionSchema = gql`
  extend type Query {
    solution(graphId: String!, solutionId: String!): Solution
  }

  extend type Mutation {
    scheduleSolution(
      graphJson: String!
      graphId: String!
      solutionId: String!
    ): String!
  }

  extend type Subscription {
    onSolution(graphId: String): SolutionManifest
  }

  type Solution {
    manifest: SolutionManifest!
    graph: SolutionGraphs!
    value(elementId: String!, parameterId: String!): SolutionValue
  }

  type SolutionGraphs {
    json: String
    ghx: String
  }

  type SolutionValue {
    type: String! # goo type
    value: String! # json based on type
  }

  type SolutionManifest {
    solutionId: String!
    graphId: String!
    duration: Int!
    runtimeMessages: [SolutionRuntimeMessage] # Grasshopper failed/warned
    exceptionMessages: [String] # NodePen failed
  }

  type SolutionRuntimeMessage {
    elementId: String!
    message: String!
    level: String!
  }
`
