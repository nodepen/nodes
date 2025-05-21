import gql from "graphql-tag"
import { issueSpeckleRequest } from "../common"
import { SpeckleRequestContext } from "../types"

type User = {
  id: string
  name: string
  email: string
  avatar: string
}

export const getActiveUser =
  (context: SpeckleRequestContext) =>
    async () => {
      const query = gql`
        query GetActiveUser {
          activeUser {
            id
            name
            email
            avatar
          }
        }
      `

      const data = await issueSpeckleRequest(context)(query, {})

      return data.activeUser as User
    }