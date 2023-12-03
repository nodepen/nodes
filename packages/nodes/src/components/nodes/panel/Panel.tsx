import React from 'react'
import type * as NodePen from '@nodepen/core'
import { useStore } from '@/store'
import { useDebugRender } from '../hooks'
import { COLORS } from '@/constants'

type PanelProps = {
  nodeInstanceId: string
  nodeTemplate: NodePen.NodeTemplate
}

const Panel = ({ nodeInstanceId, nodeTemplate }: PanelProps) => {
  const node = useStore((state) => state.document.nodes[nodeInstanceId])

  useDebugRender(node, nodeTemplate)

  const PANEL_WIDTH = 150
  const PANEL_HEIGHT = 150

  return (
    <g id={`panel-${node.instanceId}`}>
      <rect
        x={node.position.x - 4}
        y={node.position.y - 4}
        width={PANEL_WIDTH + 8}
        height={PANEL_HEIGHT + 8}
        rx={6}
        ry={6}
        fill={COLORS.PALE}
      />
      <g>
        <rect
          x={node.position.x}
          y={node.position.y}
          width={PANEL_WIDTH}
          height={PANEL_HEIGHT}
          rx={2}
          ry={2}
          stroke={COLORS.DARK}
          strokeWidth={2}
          fill={COLORS.LIGHT}
        />
      </g>
    </g>
  )
}

const propsAreEqual = (prevProps: Readonly<PanelProps>, nextProps: Readonly<PanelProps>): boolean => {
  return prevProps.nodeInstanceId === nextProps.nodeInstanceId
}

export default React.memo(Panel, propsAreEqual)
