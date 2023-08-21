import React from 'react'
import { DialogPortal } from './DialogPortal'

type DialogProps = {
  title?: string
  children: React.ReactNode
  onClose: () => void
}

export const Dialog = ({ title, onClose, children }: DialogProps) => {
  return (
    <DialogPortal>
      <div className="np-relative np-w-full np-h-full np-pointer-events-auto">
        <div
          className="np-absolute np-left-0 np-top-0 np-w-full np-h-full np-z-0 np-bg-error"
          onClick={() => {
            console.log('!')
            onClose()
          }}
        ></div>
        <div className="np-absolute np-left-0 np-top-0 np-w-full np-h-full np-z-10 np-pointer-events-none">
          <div className="np-w-full np-h-full np-flex np-justify-center np-items-center">
            <div className="np-w-96 np-h-24 np-p-4 np-bg-light np-rounded-md np-shadow-main np-pointer-events-auto">
              {children}
            </div>
          </div>
        </div>
      </div>
    </DialogPortal>
  )
}
