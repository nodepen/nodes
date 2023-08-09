import type * as NodePen from '@nodepen/core'
import { DIMENSIONS } from '@/constants'
import { clamp } from '@/utils/numerics'

export const getLabelWidth = (
  portTemplate: NodePen.PortTemplate,
  portConfiguration: NodePen.PortConfiguration
): number => {
  const labelText = portConfiguration.label ?? portTemplate.nickName
  const labelTextWidth = labelText.length * 15 // monospace

  const flagBadgesWidth = portConfiguration.flags.length * 22 + 3 * clamp(portConfiguration.flags.length - 1, 0, 10)

  const totalPadding = portConfiguration.flags.length > 0 ? DIMENSIONS.NODE_INTERNAL_PADDING : 0

  const labelTotalWidth = labelTextWidth + flagBadgesWidth + totalPadding

  return labelTotalWidth
}
