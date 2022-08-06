import React from 'react'

const ControlsContainer = (): React.ReactElement => {
  return (
    <div className="np-w-full np-h-full np-overflow-hidden np-absolute np-flex np-flex-row np-justify-start np-items-center np-pointer-events-none np-z-50">
      <div className="np-h-full np-w-64 np-p-4 np-flex np-flex-col">
        <div className="np-w-full np-h-16 np-p-4 np-mb-3 np-bg-green np-rounded-md np-shadow-main np-pointer-events-auto" />
        <div className="np-w-full np-h-8 np-p-4 np-mb-3 np-bg-green np-rounded-md np-shadow-main np-pointer-events-auto" />
        <div className="np-w-full np-h-36 np-p-4 np-mb-3 np-bg-green np-rounded-md np-shadow-main np-pointer-events-auto" />
      </div>
    </div>
  )
}

export default React.memo(ControlsContainer)
