import React, { useRef, useState } from 'react'
import { firebase } from 'features/common/context/session/auth'
import { CurrentUserMenu, NoUserMenu } from '../menus'
import { Popover } from 'features/common/popover'

type CurrentUserButtonProps = {
  user: firebase.User
  color: 'dark' | 'darkgreen'
}

const CurrentUserButton = ({ user, color }: CurrentUserButtonProps): React.ReactElement => {
  const { displayName, photoURL } = user

  const borderColor = color === 'dark' ? 'border-dark' : 'border-darkgreen'
  const hoverColor = color === 'dark' ? 'hover:bg-green' : 'hover:bg-swampgreen'
  const fillColor = color === 'dark' ? '#333333' : '#093824'

  const icon = (
    <div className="w-full h-full flex items-center justify-center">
      <svg className="w-4 h-4" fill={fillColor} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
      </svg>
    </div>
  )

  const buttonRef = useRef<HTMLButtonElement>(null)
  const popoverPosition = useRef<[number, number]>([0, 0])
  const [showPopover, setShowPopover] = useState(false)

  const handleShowPopover = (): void => {
    const button = buttonRef.current

    if (!button) {
      return
    }

    const { left, top, width, height } = button.getBoundingClientRect()

    popoverPosition.current = [left + width, top + height + 8]

    setShowPopover(true)
  }

  return (
    <>
      <button
        ref={buttonRef}
        className={`${borderColor} ${hoverColor} h-6 w-6 rounded-sm border-2 overflow-hidden`}
        onClick={handleShowPopover}
      >
        {icon}
      </button>
      {showPopover ? (
        <Popover position={popoverPosition.current} anchor="TR" onClose={() => setShowPopover(false)}>
          {user.isAnonymous ? <NoUserMenu /> : <CurrentUserMenu user={{ name: displayName, photoUrl: photoURL }} />}
        </Popover>
      ) : null}
    </>
  )
}

export default React.memo(CurrentUserButton)
