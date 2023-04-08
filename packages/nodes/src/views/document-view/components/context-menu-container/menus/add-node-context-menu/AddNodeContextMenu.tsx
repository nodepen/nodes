import React from 'react'
import { useStore } from '$'
import type { ContextMenu } from '../../types'
import { MenuBody, MenuButton, MenuHeader } from '../../common'
import { getIconAsImage } from '@/utils/templates'

type AddNodeContextMenuProps = {
  position: ContextMenu['position']
}

export const AddNodeContextMenu = ({ position: eventPosition }: AddNodeContextMenuProps) => {
  const templates = useStore((state) => Object.values(state.templates))

  const menuPosition = {
    x: eventPosition.x - (192 / 2),
    y: eventPosition.y - 185 - 5
  }

  return (
    <MenuBody position={menuPosition} animate={false}>
      <MenuButton icon={<></>} label="A" action={() => ''} />
      <MenuButton icon={<></>} label="B" action={() => ''} />
      <MenuButton icon={<></>} label="C" action={() => ''} />
      <MenuButton icon={<></>} label="D" action={() => ''} />
      <input className="np-w-full np-h-8 np-pl-2 np-pr-2 np-font-sans np-text-md np-text-dark np-text-left np-bg-pale np-shadow-input"
        type="text" />
    </MenuBody>
  )
}