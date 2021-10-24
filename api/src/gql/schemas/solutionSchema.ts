import { gql } from 'apollo-server-express'

export const solutionSchema = gql`
  extend type Subscription {
    onSolution(solutionId: String): SolutionManifest
  }

  type SolutionManifest {
    solutionId: String!
  }
`
