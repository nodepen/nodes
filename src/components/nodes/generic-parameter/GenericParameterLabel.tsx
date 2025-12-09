import type * as NodePen from '@/types'
import { COLORS, DIMENSIONS } from '@/constants'
import { usePortLabel } from '@/hooks/usePortLabel'

const { NODE_INTERNAL_PADDING, NODE_LABEL_FONT_SIZE, NODE_LABEL_WIDTH, NODE_PORT_MINIMUM_WIDTH } = DIMENSIONS

type GenericParameterLabelProps = {
  node: NodePen.DocumentNode
  template: NodePen.NodeTemplate
}

export const GenericParameterLabel = ({ node, template }: GenericParameterLabelProps) => {
  const { instanceId: id, position, dimensions } = node

  const { currentLabel } = usePortLabel(node.instanceId, 'output')

  const labelY = position.y + dimensions.height - NODE_INTERNAL_PADDING * 2
  const labelX = position.x + 9 + 18 + 9

  return (
    <>
      <line id={`param-label-path-${id}`} x1={labelX} y1={labelY} x2={labelX + NODE_PORT_MINIMUM_WIDTH * 2} y2={labelY} stroke="none" />
      <text className="np-font-panel np-select-none np-pointer-events-none" fill={COLORS.DARK} fontSize={NODE_LABEL_FONT_SIZE}>
        <textPath href={`#param-label-path-${id}`} textAnchor="start">
          {currentLabel}
        </textPath>
      </text>

    </>
  )
}