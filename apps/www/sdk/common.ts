import { DocumentNode, print } from "graphql"

type SpeckleRequestContext = {
  speckleServerUrl: string
  speckleToken: string
}

export const issueSpeckleRequest = async (query: DocumentNode, variables: Record<string, unknown>, context: SpeckleRequestContext) => {
  const { speckleServerUrl, speckleToken } = context

  const res = await fetch(`${speckleServerUrl}/graphql`, {
    method: 'POST',
    headers: {
      Authorization: speckleToken
    },
    body: JSON.stringify({
      query: print(query),
      variables
    })
  })
}