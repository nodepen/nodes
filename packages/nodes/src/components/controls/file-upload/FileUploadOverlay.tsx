import React from 'react'
import { useStore } from '$'

const FileUploadOverlay = (): React.ReactElement => {
  const { isActive, activeFile, uploadStatus } = useStore((state) => state.layout.fileUpload)

  if (!isActive) {
    return <></>
  }

  return <div className="np-w-full np-h-full np-bg-warn" />
}

export default React.memo(FileUploadOverlay)
