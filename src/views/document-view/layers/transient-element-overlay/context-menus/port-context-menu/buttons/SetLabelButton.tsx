import React, { useCallback } from 'react'
import type * as NodePen from '@/types'
import { MenuButton } from '../../../common'
import { STYLES } from '@/constants'

type SetLabelButtonProps = {
  onClick: (pageY: number) => void,
}

export const SetLabelButton = ({ onClick }: SetLabelButtonProps) => {
  const handleSetLabel = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
    const { top } = e.currentTarget.getBoundingClientRect()
    onClick(top)
  }, [])

  const icon = (
    <svg {...STYLES.BUTTON.SMALL}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
    </svg>
  )

  return <MenuButton icon={icon} label={`Set label`} action={handleSetLabel} />
}
