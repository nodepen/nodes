import { gql } from 'apollo-server-express'

/**
 * Types related to scheduling and reading solution results.
 */
export const solutionSchema = gql`
  extend type Subscription {
    onSolution(solutionId: String): SolutionManifest
  }

  type SolutionManifest {
    solutionId: String!
  }
`
