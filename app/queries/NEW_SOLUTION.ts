import { gql } from '@apollo/client'

export const NEW_SOLUTION = gql`
  mutation($sessionId: String!, $solutionId: String!, $graph: String!) {
    newSolution(sessionId: $sessionId, solutionId: $solutionId, graph: $graph)
  }
`
