import React, { useCallback, useRef } from 'react'
import type * as NodePen from '@nodepen/core'
import { useLongHover, usePageSpaceToOverlaySpace } from '@/hooks'
import { MenuButton } from '../../../common'
import { getIconAsImage } from '@/utils/templates'
import { useDispatch } from '@/store'
import { KEYS } from '@/constants'

type AddNodeButtonProps = {
  template: NodePen.NodeTemplate
  isSelected: boolean
  action: () => void
}

export const AddNodeButton = ({ template, isSelected, action }: AddNodeButtonProps) => {
  const { apply } = useDispatch()
  const pageSpaceToOverlaySpace = usePageSpaceToOverlaySpace()

  const buttonRef = useRef<HTMLDivElement>(null)

  const handleLongHover = useCallback(() => {
    const element = buttonRef.current

    if (!element) {
      return
    }

    const { left, top, width } = element.getBoundingClientRect()

    const tooltipPagePosition = {
      x: left + width + 12,
      y: top - 4,
    }

    const [px, py] = pageSpaceToOverlaySpace(tooltipPagePosition.x, tooltipPagePosition.y)

    apply((state) => {
      state.registry.tooltips[KEYS.TOOLTIPS.ADD_NODE_MENU_OPTION_HOVER] = {
        configuration: {
          position: {
            x: px,
            y: py,
          },
          isSticky: true,
        },
        context: {
          type: 'node-template-summary',
          template,
        },
      }
    })
  }, [])

  const longHoverTarget = useLongHover<HTMLDivElement>(handleLongHover)

  return (
    <div ref={buttonRef}>
      <div ref={longHoverTarget}>
        <MenuButton
          label={template.name}
          icon={<img src={getIconAsImage(template)} alt={template.name} />}
          isSelected={isSelected}
          action={action}
        />
      </div>
    </div>
  )
}
