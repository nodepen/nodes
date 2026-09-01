import React, { useCallback } from 'react'
import { MenuButton } from '../../../common'
import type { PortFlag } from '@/types'
import { ReparameterizeFlagIcon } from '@/components/icons/ReparameterizeFlagIcon'

type ReparameterizeButtonProps = {
  onClick: (flag: PortFlag) => void
}

export const ReparameterizeButton = ({ onClick }: ReparameterizeButtonProps) => {
  const handleReparameterize = useCallback(() => {
    onClick('reparameterize')
  }, [])

  const icon = (
    <div className="np-w-[18px] np-h-[18px] np-rounded-sm np-bg-light np-border-2 np-border-dark np-flex np-justify-center np-items-center">
      <ReparameterizeFlagIcon />
    </div>
  )

  return <MenuButton icon={icon} label="Reparameterize" action={handleReparameterize} />
}
