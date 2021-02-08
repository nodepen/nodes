import { gql } from '@apollo/client'

export const SOLUTION_VALUE = gql`
  query($sessionId: String!, $solutionId: String!, $elementId: String!, $parameterId: String!) {
    getSolutionValue(sessionId: $sessionId, solutionId: $solutionId, elementId: $elementId, parameterId: $parameterId) {
      data
    }
  }
`
