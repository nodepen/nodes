import { DocumentNode, print } from "graphql"
import { SpeckleRequestContext } from "./types"

export const issueSpeckleRequest =
  (context: SpeckleRequestContext) =>
    async (query: DocumentNode, variables: Record<string, unknown>) => {
      const { speckleServerUrl, speckleToken } = context

      console.log(context)

      const res = await fetch(`${speckleServerUrl}/graphql`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${speckleToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: print(query),
          variables
        })
      })

      const { data } = await res.json()

      return data
    }