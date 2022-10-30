import React from 'react'
import { usePseudoShadow } from '@/views/common/pseudo-shadow'

type NavigationButtonProps = {
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  children: React.ReactNode
}

export const NavigationButton = ({ onClick, children }: NavigationButtonProps): React.ReactElement => {
  const shadowTarget = usePseudoShadow()

  return (
    <div className="np-w-8 np-h-8 np-rounded-md np-bg-light np-shadow-main" ref={shadowTarget}>
      <button
        className="np-w-full np-h-full np-flex np-justify-center np-items-center np-pointer-events-auto"
        onClick={onClick}
      >
        {children}
      </button>
    </div>
  )
}
