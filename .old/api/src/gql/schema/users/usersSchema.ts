import { gql } from 'apollo-server-express'

/**
 * Types related to user and identity management.
 * @remarks `currentUser` operations use the user associated with the provided
 *    auth token and can surface user-private information (like usage, not identity).
 * @remarks `publicUser` operations are public operations and will only surface
 *    publicly-visible information (like usernames, or public graph count)
 */
export const usersSchema = gql`
  extend type Query {
    currentUser: UserRecord!
    publicUserByUsername(username: String!): UserReference
  }

  type UserReference {
    username: String!
    photoUrl: String
  }

  type UserRecord {
    username: String!
    limits: UserLimits!
    usage: UserUsage!
    time: UserTimestamps!
  }

  type UserLimits {
    ms: Int!
    msPerSolution: Int!
  }

  type UserUsage {
    ms: Int!
  }

  type UserTimestamps {
    created: String!
    visited: String!
  }
`
