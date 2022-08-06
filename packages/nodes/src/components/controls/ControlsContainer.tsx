import React from 'react'

const ControlsContainer = (): React.ReactElement => {
  return (
    <div className="np-w-full np-h-full np-overflow-hidden np-absolute np-flex np-flex-row np-justify-start np-items-center np-pointer-events-none np-z-50">
      <div className="np-h-full np-w-72 np-p-4 np-flex np-flex-col">
        <div className="np-w-full np-flex-grow np-flex np-flex-col">
          <div className="np-w-full np-h-16 np-p-4 np-mb-3 np-bg-green np-rounded-md np-shadow-main np-pointer-events-auto" />
          <div className="np-w-full np-h-8 np-p-4 np-mb-3 np-bg-green np-rounded-md np-shadow-main np-pointer-events-auto" />
          <div className="np-w-full np-h-36 np-p-4 np-mb-3 np-bg-green np-rounded-md np-shadow-main np-pointer-events-auto" />
        </div>
        <div className="np-w-full np-h-8 np-flex np-justify-between np-items-center np-gap-2">
          <button className="np-w-8 np-h-8 np-rounded-md np-bg-light np-shadow-main np-pointer-events-auto" />
          <button className="np-w-8 np-h-8 np-rounded-md np-bg-light np-shadow-main np-pointer-events-auto" />
          <button className="np-w-8 np-h-8 np-rounded-md np-bg-light np-shadow-main np-pointer-events-auto" />
          <div className="np-flex-grow np-h-8 np-rounded-md np-bg-light np-shadow-main" />
          <button className="np-w-8 np-h-8 np-rounded-md np-bg-light np-shadow-main np-pointer-events-auto" />
        </div>
      </div>
    </div>
  )
}

export default React.memo(ControlsContainer)
