import { gql } from '@apollo/client'

export const USER_SESSION = gql`
  query UserSession($id: String!) {
    getUser(id: $id) {
      session
    }
  }
`
