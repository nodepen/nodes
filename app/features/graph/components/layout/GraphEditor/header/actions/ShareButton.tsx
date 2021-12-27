import React, { useState, useRef } from 'react'
import { useRouter } from 'next/router'
import { Popover } from '@/features/common/popover'
import { ShareGraphMenu } from '../menus'

const ShareButton = (): React.ReactElement => {
  const router = useRouter()

  const buttonRef = useRef<HTMLButtonElement>(null)
  const buttonPosition = useRef<[number, number]>([0, 0])
  const [showPopover, setShowPopover] = useState(false)

  const handleShowPopover = (): void => {
    const button = buttonRef.current

    if (!button) {
      return
    }

    const { left, top, width, height } = button.getBoundingClientRect()

    buttonPosition.current = [left + width, top + height + 8]

    setShowPopover(true)
  }

  return (
    <>
      <button
        className="h-6 w-6 mr-2 border-2 border-dark rounded-sm bg-white flex items-center justify-center hover:bg-green"
        ref={buttonRef}
        onClick={handleShowPopover}
      >
        <svg className="w-3 h-3" fill="#333" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"></path>
        </svg>
      </button>
      {showPopover ? (
        <Popover position={buttonPosition.current} anchor="TR" onClose={() => setShowPopover(false)}>
          <ShareGraphMenu />
        </Popover>
      ) : null}
    </>
  )
}

export default React.memo(ShareButton)
