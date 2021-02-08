import { gql } from '@apollo/client'

export const SOLUTION_MESSAGES = gql`
  query($sessionId: String!, $solutionId: String!) {
    getSolutionMessages(sessionId: $sessionId, solutionId: $solutionId)
  }
`
