import React from 'react'
import { useGraphFiles } from '@/features/graph/store/graph/hooks'

const DownloadButton = (): React.ReactElement => {
  const { graphBinaries } = useGraphFiles()

  const handleDownload = (): void => {
    if (!graphBinaries) {
      console.log('🐍 No graph url available!')
      return
    }

    const anchor = document.createElement('a')

    anchor.href = graphBinaries
    anchor.click()

    anchor.remove()
  }

  return (
    <button
      className="h-6 w-6 mr-2 border-2 border-dark rounded-sm bg-white flex items-center justify-center hover:bg-green"
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
