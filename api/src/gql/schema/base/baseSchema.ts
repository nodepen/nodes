import { gql } from 'apollo-server-express'

/**
 * Required base types for other fragments to extend.
 */
export const baseSchema = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }

  type Subscription {
    _empty: String
  }
`
