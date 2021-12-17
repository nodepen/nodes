import React, { useState } from 'react'
import { gql, useApolloClient } from '@apollo/client'
import { useSolutionDispatch, useSolutionMetadata } from 'features/graph/store/solution/hooks'

type DownloadButtonProps = {
  graphId: string
}

const DownloadButton = ({ graphId }: DownloadButtonProps): React.ReactElement => {
  const client = useApolloClient()

  const { expireSolution } = useSolutionDispatch()
  const { id: solutionId } = useSolutionMetadata()

  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = (): void => {
    if (isDownloading) {
      return
    }

    setIsDownloading(true)

    client
      .query({
        query: gql`
          query GetSolutionGrasshopperFile($graphId: String!, $solutionId: String!) {
            solution(graphId: $graphId, solutionId: $solutionId) {
              files {
                gh
              }
            }
          }
        `,
        variables: {
          graphId,
          solutionId,
        },
      })
      .then((res) => {
        const { gh } = res.data.solution.files

        if (gh) {
          let fileData: any = atob(gh)

          const bytes = new Array(fileData.length)
          for (let i = 0; i < fileData.length; i++) {
            bytes[i] = fileData.charCodeAt(i)
          }
          fileData = new Uint8Array(bytes)

          const blob = new Blob([fileData], { type: 'application/octet-stream' })
          const objectURL = window.URL.createObjectURL(blob)
          const anchor = document.createElement('a')

          anchor.href = objectURL
          anchor.download = 'nodepen.gh'
          anchor.click()

          URL.revokeObjectURL(objectURL)
        } else {
          console.error('🐍 Failed to download grasshopper file for current solution.')
          expireSolution()
        }
      })
      .catch(() => {
        console.error('🐍 Failed to download grasshopper file for current solution.')
      })
      .finally(() => {
        setIsDownloading(false)
      })
  }

  return (
    <button
      className="h-6 w-6 mr-2 border-2 border-dark rounded-sm bg-white flex items-center justify-center"
      onClick={handleDownload}
    >
      <svg className="w-4 h-4" fill="#333333" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path
          fillRule="evenodd"
          d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  )
}

export default React.memo(DownloadButton)
