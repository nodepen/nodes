import React, { useState } from 'react'

type ShareButtonProps = {
  graphId: string
}

const ShareButton = ({ graphId }: ShareButtonProps): React.ReactElement => {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <button
        className="h-6 w-6 mr-2 border-2 border-dark rounded-sm bg-white flex items-center justify-center"
        onClick={() => setShowModal((current) => !current)}
      >
        <svg className="w-3 h-3" fill="#333" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"></path>
        </svg>
      </button>
    </>
  )
}

export default React.memo(ShareButton)
