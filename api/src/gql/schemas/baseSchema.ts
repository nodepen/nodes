import { gql } from 'apollo-server-express'

export const baseSchema = gql`
  type Query {
    _empty: String
  }

  type Subscription {
    _empty: String
  }
`
