import React, { useCallback } from 'react'
import { MenuButton } from '../../../common'
import { STYLES } from '@/constants'
import { SimplifyFlagIcon } from '@/components/icons/SimplifyFlagIcon'
import { useDispatch } from '@/store'
import type { PortFlag } from '@/types'

type SimplifyButtonProps = {
  onClick: (flag: PortFlag) => void
}

export const SimplifyButton = ({ onClick }: SimplifyButtonProps) => {
  const handleSimplify = useCallback(() => {
    onClick('simplify')
  }, [])

  const icon = (
    <div className="np-w-[18px] np-h-[18px] np-rounded-sm np-bg-light np-border-2 np-border-dark np-flex np-justify-center np-items-center">
      <SimplifyFlagIcon />
    </div>
  )

  return <MenuButton icon={icon} label="Simplify" action={handleSimplify} />
}
