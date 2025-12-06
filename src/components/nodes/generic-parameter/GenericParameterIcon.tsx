import React, { useCallback } from 'react'
import type * as NodePen from '@/types'
import { useStore } from '$'
import { COLORS } from '@/constants'
import { PortTypeIcon } from '@/components/icons'

type GenericParameterIconProps = {
  node: NodePen.DocumentNode,
  template: NodePen.NodeTemplate
}

export const GenericParameterIcon = ({ node }: GenericParameterIconProps) => {
  const { x, y } = node.position

  // TODO: Get icon based on template type
  // const icon = getParameterIcon()

  return <PortTypeIcon position={{ x: x + 9, y: y + 6 }} />
}