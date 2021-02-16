import { gql } from '@apollo/client'

export const GRAPH_JSON = gql`
  query($sessionId: String!, $solutionId: String!) {
    getGraphJson(sessionId: $sessionId, solutionId: $solutionId)
  }
`
