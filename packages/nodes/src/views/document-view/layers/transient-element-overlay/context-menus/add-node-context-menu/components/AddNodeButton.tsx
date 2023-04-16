import React, { useCallback } from 'react'
import type * as NodePen from '@nodepen/core'
import { useLongHover } from '@/hooks'
import { MenuButton } from '../../../common'
import { getIconAsImage } from '@/utils/templates'

type AddNodeButtonProps = {
  template: NodePen.NodeTemplate
  isSelected: boolean
  action: () => void
}

export const AddNodeButton = ({ template, isSelected, action }: AddNodeButtonProps) => {
  const handleLongHover = useCallback(() => {
    console.log(template.name)
  }, [])

  const longHoverTarget = useLongHover<HTMLDivElement>(handleLongHover)

  return (
    <div ref={longHoverTarget}>
      <MenuButton
        label={template.name}
        icon={<img src={getIconAsImage(template)} alt={template.name} />}
        isSelected={isSelected}
        action={action}
      />
    </div>
  )
}
