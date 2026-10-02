import React, { useCallback } from 'react'
import { MenuButton } from '../../../common'
import type { PortFlag } from '@/types'
import { GraftFlagIcon } from '@/components/icons/GraftFlagIcon'

type GraftButtonProps = {
  onClick: (flag: PortFlag) => void
}

export const GraftButton = ({ onClick }: GraftButtonProps) => {
  const handleGraft = useCallback(() => {
    onClick('graft')
  }, [])

  const icon = (
    <div className="np-w-[18px] np-h-[18px] np-rounded-sm np-bg-light np-border-2 np-border-dark np-flex np-justify-center np-items-center">
      <GraftFlagIcon />
    </div>
  )

  return <MenuButton icon={icon} label="Graft" action={handleGraft} />
}
