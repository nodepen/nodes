import React, { useRef, useCallback } from 'react'
import { useDispatch, useStore } from '$'
import { COLORS } from '@/constants'
import { DraggableNodeContainer } from '../common'

type GenericNodeProps = {
  id: string
}

const GenericNode = ({ id }: GenericNodeProps): React.ReactElement => {
  const node = useStore((store) => store.document.nodes[id])

  console.log(`Rendered node ${id}`)

  const { position } = node

  return (
    <DraggableNodeContainer id={id}>
      <rect
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
      />
    </DraggableNodeContainer>
  )
}

const propsAreEqual = (prevProps: Readonly<GenericNodeProps>, nextProps: Readonly<GenericNodeProps>): boolean => {
  return prevProps.id === nextProps.id
}

export default React.memo(GenericNode, propsAreEqual)
