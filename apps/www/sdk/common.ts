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

      const { data, error } = await res.json()

      console.log(JSON.stringify(data, null, 2))

      if (!!error) {
        console.log(error)
        throw new Error(error)
      }

      return data
    }
