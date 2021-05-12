import { gql } from '@apollo/client'

export const SOLUTION_STATUS = gql`
  query($sessionId: String!, $solutionId: String!) {
    getSolutionStatus(sessionId: $sessionId, solutionId: $solutionId) {
      status
      started_at
      finished_at
      duration
      parameter_count
    }
  }
`
