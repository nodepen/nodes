import React, { useCallback, useState, useTransition, useRef, useEffect } from 'react'
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

  const searchQueryInputRef = useRef<HTMLInputElement>(null)
  const [searchQuery, setSearchQuery] = useState<string>()
  const [_isPending, startTransition] = useTransition()

  const { exactMatch, candidates } = useTextSearch(templates, searchQuery ?? '', ['name', 'nickName', 'keywords'])

  const updateSearchQuery = useCallback(() => {
    const element = searchQueryInputRef.current

    if (!element) {
      return
    }

    startTransition(() => {
      setSearchQuery(element.value)
    })
  }, [])

  const debounceUpdateSearchQuery = useDebounceCallback(updateSearchQuery, 200)

  const searchResults = exactMatch
    ? [...candidates.slice(0, 3).reverse(), exactMatch]
    : candidates.slice(0, 4).reverse()

  useEffect(() => {
    const element = searchQueryInputRef.current

    if (!element) {
      return
    }

    queueMicrotask(() => {
      element.focus()
    })
  }, [])

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
        ref={searchQueryInputRef}
        className="np-w-full np-h-8 np-pl-2 np-pr-2 np-font-sans np-text-md np-text-dark np-text-left np-bg-pale np-shadow-input"
        type="text"
        onChange={debounceUpdateSearchQuery}
      />
    </MenuBody>
  )
}

const useDebounceCallback = (callback: () => void, delay: number): (() => void) => {
  const internalTimeout = useRef<ReturnType<typeof setTimeout>>()

  const internalCallback = useCallback(() => {
    if (internalTimeout.current) {
      clearTimeout(internalTimeout.current)
    }

    internalTimeout.current = setTimeout(() => {
      callback()
    }, delay)
  }, [callback])

  return internalCallback
}
