import type * as NodePen from '@/types'
import { DIMENSIONS } from '@/constants'
import { clamp } from '@/utils/numerics'

export const getLabelWidth = (
    portTemplate: NodePen.PortTemplate,
    portConfiguration: NodePen.PortConfiguration,
    useFullName = false
): number => {
    const labelText = portConfiguration.label ?? (useFullName ? portTemplate.name : portTemplate.nickName)
    const labelTextWidth = labelText.length * 15 // monospace

    const flagBadgesWidth = portConfiguration.flags.length * DIMENSIONS.NODE_PORT_FLAG_SIZE + 3 * clamp(portConfiguration.flags.length - 1, 0, 10)

    const totalPadding = (portConfiguration.flags.length > 0 ? DIMENSIONS.NODE_INTERNAL_PADDING : 0) + DIMENSIONS.NODE_PORT_CHIP_SIZE + DIMENSIONS.NODE_INTERNAL_PADDING + 4

    const labelTotalWidth = labelTextWidth + flagBadgesWidth + totalPadding

    return labelTotalWidth
}
