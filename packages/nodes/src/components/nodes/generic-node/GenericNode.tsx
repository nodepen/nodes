import React, { useRef, useCallback } from 'react'
import { useStore } from '$'
import { COLORS } from '@/constants'

type GenericNodeProps = {
  id: string
}

const GenericNode = ({ id }: GenericNodeProps): React.ReactElement => {
  const element = useStore((store) => store.document.elements[id])
  const translate = useStore((store) => store.dispatch.test)

  console.log(`Rendered ${id}`)

  const ref = useRef<SVGRectElement>(null)

  const handlePointerDown = useCallback((e: React.PointerEvent<SVGRectElement>): void => {
    switch (e.pointerType) {
      case 'pen':
      case 'touch': {
        // Ignore touch events for now
        return
      }
      case 'mouse': {
        switch (e.button) {
          case 0: {
            // Consume event
            e.stopPropagation()

            translate(id)

            // Immediately select

            // Begin move
            return
          }
          case 1: {
            // Do nothing
            return
          }
          case 2: {
            // Do nothing
            return
          }
        }
      }
    }
  }, [])

  const { position } = element

  return (
    <g id={`generic-node-${id}`}>
      <rect
        ref={ref}
        x={position.x}
        y={-position.y}
        width={250}
        height={120}
        rx={7}
        ry={7}
        fill={COLORS.LIGHT}
        stroke={COLORS.DARK}
        strokeWidth={2}
        vectorEffect="non-scaling-stroke"
        onPointerDown={handlePointerDown}
      />
    </g>
  )
}

const propsAreEqual = (prevProps: Readonly<GenericNodeProps>, nextProps: Readonly<GenericNodeProps>): boolean => {
  return prevProps.id === nextProps.id
}

export default React.memo(GenericNode, propsAreEqual)
