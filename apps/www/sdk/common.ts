import { DocumentNode, getOperationAST, print } from "graphql"
import { SpeckleRequestContext } from "./types"

export const issueSpeckleRequest =
  (context: SpeckleRequestContext) =>
    async (query: DocumentNode, variables: Record<string, unknown>) => {
      const { speckleServerUrl, speckleToken } = context

      console.log(getOperationAST(query)?.name?.value)

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

      const { data, errors } = await res.json()

      if (errors?.length) {
        for (const error of errors) {
          console.log(error)
        }
      }

      return data
    }
