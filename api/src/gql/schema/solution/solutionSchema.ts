import { gql } from 'apollo-server-express'

/**
 * Types related to scheduling and reading solution results.
 */
export const solutionSchema = gql`
  extend type Query {
    restore: SolutionSnapshot
    solution(graphId: String!, solutionId: String): Solution
  }

  extend type Mutation {
    scheduleSolution(
      observerId: String!
      graphJson: String!
      graphId: String!
      solutionId: String!
    ): String!
    updateSelection(
      observerId: String!
      graphId: String!
      selection: [String]!
    ): GraphSelection
  }

  extend type Subscription {
    onSolutionStart(graphId: String): SolutionSnapshot
    onSolutionFinish(graphId: String): SolutionManifest
    onUpdateSelection(graphId: String): GraphSelection
  }

  type GraphSelection {
    observerId: String!
    graphId: String!
    selection: [String]!
  }

  type SolutionSnapshot {
    observerId: String!
    graphJson: String!
    graphId: String!
    solutionId: String!
  }

  type Solution {
    manifest: SolutionManifest!
    files: SolutionFiles!
    value(elementId: String!, parameterId: String!): [SolutionDataTreeBranch]
  }

  type SolutionFiles {
    json: String
    gh: String
  }

  type SolutionDataTreeBranch {
    path: [Int]!
    data: [SolutionValue]!
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
