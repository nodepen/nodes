import { gql } from 'apollo-server-express'

/**
 * Types related to scheduling and reading solution results.
 */
export const solutionSchema = gql`
  extend type Mutation {
    scheduleSolution(context: ScheduleSolutionInput!): String!
  }

  extend type Subscription {
    onSolution(solutionId: String): SolutionManifest
  }

  input ScheduleSolutionInput {
    solutionId: String!
    graphId: String!
    graphElements: String! #json
  }

  type SolutionManifest {
    solutionId: String!
  }
`
