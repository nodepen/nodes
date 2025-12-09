import React, { useCallback } from 'react'
import { MenuButton } from '../../../common'
import { STYLES } from '@/constants'
import type { PortFlag } from '@/types'
import { FlattenFlagIcon } from '@/components/icons/FlattenFlagIcon'

type FlattenButtonProps = {
  onClick: (flag: PortFlag) => void
}

export const FlattenButton = ({ onClick }: FlattenButtonProps) => {
  const handleFlatten = useCallback(() => {
    onClick('flatten')
  }, [])

  const icon = (
    <div className="np-w-[18px] np-h-[18px] np-rounded-sm np-bg-light np-border-2 np-border-dark np-flex np-justify-center np-items-center">
      <FlattenFlagIcon />
    </div>
  )

  return <MenuButton icon={icon} label="Flatten" action={handleFlatten} />
}
