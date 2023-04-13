import React, { useState } from 'react'
import { useStore } from '$'
import type { ContextMenu } from '../../types'
import { MenuBody, MenuButton } from '../../common'
import { getIconAsImage } from '@/utils/templates'
import { useTextSearch } from './hooks'

type AddNodeContextMenuProps = {
  position: ContextMenu['position']
}

export const AddNodeContextMenu = ({ position: eventPosition }: AddNodeContextMenuProps) => {
  const templates = useStore((state) => Object.values(state.templates))

  const menuPosition = {
    x: eventPosition.x - 192 / 2,
    y: eventPosition.y - 185 - 5,
  }

  const [searchQuery, setSearchQuery] = useState<string>()
  const { exactMatch, candidates } = useTextSearch(templates, searchQuery ?? '', ['name', 'nickName', 'keywords'])

  // TODO: Debounce query or something on search

  const searchResults = exactMatch
    ? [...candidates.slice(0, 3).reverse(), exactMatch]
    : candidates.slice(0, 4).reverse()

  return (
    <MenuBody position={menuPosition} animate={false}>
      {searchResults.map((template, i) => (
        <MenuButton
          key={`add-node-menu-entry-${i}-${template.guid}`}
          icon={<img src={getIconAsImage(template)} alt={`${template.name}`} />}
          label={template.name}
          action={() => ''}
        />
      ))}
      <input
        className="np-w-full np-h-8 np-pl-2 np-pr-2 np-font-sans np-text-md np-text-dark np-text-left np-bg-pale np-shadow-input"
        type="text"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value)
        }}
      />
    </MenuBody>
  )
}
