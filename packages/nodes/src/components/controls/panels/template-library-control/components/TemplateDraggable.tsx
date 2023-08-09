import React, { useCallback, useRef } from 'react'
import type * as NodePen from '@nodepen/core'
import { createInstance, getIconAsImage } from '@/utils/templates'
import { useLongHover, usePageSpaceToOverlaySpace, usePageSpaceToWorldSpace } from '@/hooks'
import { useDispatch } from '@/store'
import { KEYS } from '@/constants'

type TemplateDraggableProps = {
  template: NodePen.NodeTemplate
}

const TemplateDraggable = ({ template }: TemplateDraggableProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null)

  const { apply } = useDispatch()

  const pageSpaceToWorldSpace = usePageSpaceToWorldSpace()
  const pageSpaceToOverlaySpace = usePageSpaceToOverlaySpace()

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>): void => {
      e.stopPropagation()

      const { pageX, pageY } = e

      const [x, y] = pageSpaceToWorldSpace(pageX, pageY)

      const node = createInstance(template)

      apply((state) => {
        state.layout.activeView = 'document'

        node.status.isProvisional = true
        node.position = {
          x: x - node.dimensions.width / 2,
          y: y - node.dimensions.height / 2,
        }

        state.document.nodes[node.instanceId] = node

        state.layout.nodePlacement = {
          isActive: true,
          activeNodeId: node.instanceId,
        }
      })
    },
    [apply, pageSpaceToWorldSpace]
  )

  const handleLongHover = useCallback(
    (_e: PointerEvent): void => {
      const element = buttonRef.current

      if (!element) {
        return
      }

      const { top } = element.getBoundingClientRect()

      const [_x, y] = pageSpaceToOverlaySpace(0, top)

      apply((state) => {
        state.registry.tooltips[KEYS.TOOLTIPS.TEMPLATE_LIBRARY_CONTROL_OPTION_HOVER] = {
          configuration: {
            position: {
              x: 280,
              y: y - 4,
            },
            isSticky: true,
          },
          context: {
            type: 'node-template-summary',
            template,
          },
        }
      })
    },
    [apply]
  )

  const longHoverTarget = useLongHover<HTMLDivElement>(handleLongHover)

  return (
    <div ref={longHoverTarget} className="np-w-full np-pt-[100%] np-relative hover:np-bg-swampgreen np-rounded-sm">
      <button
        key={`template-library-template-icon-${template.guid}`}
        ref={buttonRef}
        onPointerDown={handlePointerDown}
        className="np-absolute np-w-full np-top-0 np-right-0 np-left-0 np-bottom-0"
      >
        <div className="np-w-full np-h-full np-flex np-items-center np-justify-center">
          <img
            width={22}
            draggable={false}
            src={getIconAsImage(template)}
            alt={`${template.name} (${template.nickName}): ${template.description}`}
          />
        </div>
      </button>
    </div>
  )
}

const propsAreEqual = (prevProps: TemplateDraggableProps, nextProps: TemplateDraggableProps): boolean => {
  return prevProps.template.guid === nextProps.template.guid
}

export default React.memo(TemplateDraggable, propsAreEqual)
