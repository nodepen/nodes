import { gql } from '@apollo/client'

export const SESSION_CURRENT_SOLUTION = gql`
  query($id: String!) {
    getSession(id: $id) {
      current
    }
  }
`
