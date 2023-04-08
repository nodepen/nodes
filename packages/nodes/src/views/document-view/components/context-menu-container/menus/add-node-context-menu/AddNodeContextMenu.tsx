import React from 'react'
import { useStore } from '$'
import type { ContextMenu } from '../../types'
import { MenuBody, MenuHeader } from '../../common'
import { getIconAsImage } from '@/utils/templates'

type AddNodeContextMenuProps = {
  position: ContextMenu['position']
}

export const AddNodeContextMenu = ({ position }: AddNodeContextMenuProps) => {
  const templates = useStore((state) => Object.values(state.templates))

  return (
    <MenuBody position={position}>
      <></>
    </MenuBody>
  )
}