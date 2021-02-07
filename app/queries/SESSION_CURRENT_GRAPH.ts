import { gql } from '@apollo/client'

export const SESSION_CURRENT_GRAPH = gql`
  query($sessionId: String!) {
    getSessionCurrentGraph(sessionId: $sessionId)
  }
`
