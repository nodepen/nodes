import React, { useCallback } from 'react'
import type * as NodePen from '@/types'
import { MenuButton } from '../../../common'
import { STYLES } from '@/constants'

type SetValueButtonProps = {
  nodeInstanceId: string
  portInstanceId: string
  portTemplate: NodePen.PortTemplate
  onClick: (pageY: number) => void,
}

export const SetValueButton = ({ nodeInstanceId, portInstanceId, portTemplate, onClick }: SetValueButtonProps) => {
  const { typeName } = portTemplate

  const handleSetValue = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
    const { top } = e.currentTarget.getBoundingClientRect()
    onClick(top)
  }, [])

  const icon = (
    <svg {...STYLES.BUTTON.SMALL}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
  )

  return <MenuButton icon={icon} label={`Set ${typeName} value`} action={handleSetValue} />
}
