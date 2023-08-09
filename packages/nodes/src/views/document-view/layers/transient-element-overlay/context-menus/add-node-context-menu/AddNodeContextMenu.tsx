import React, { useCallback, useState, useTransition, useRef, useEffect } from 'react'
import type * as NodePen from '@nodepen/core'
import { useDispatch, useStore } from '$'
import type { ContextMenu } from '../../types'
import { MenuBody } from '../../common'
import { clamp } from '@/utils/numerics'
import { createInstance } from '@/utils/templates'
import { useTextSearch } from './hooks'
import { useOverlaySpaceToWorldSpace } from '@/hooks'
import { AddNodeButton } from './components'
import { KEYS } from '@/constants'
import { expireSolution } from '@/store/utils'

type AddNodeContextMenuProps = {
  position: ContextMenu['position']
}

export const AddNodeContextMenu = ({ position: eventPosition }: AddNodeContextMenuProps) => {
  const templates = useStore((state) => Object.values(state.templates))
  const { apply } = useDispatch()

  const overlaySpaceToWorldSpace = useOverlaySpaceToWorldSpace()

  const menuPosition = {
    x: eventPosition.x - 192 / 2,
    y: eventPosition.y - 185 - 5,
  }

  const searchQueryInputRef = useRef<HTMLInputElement>(null)
  const [searchQuery, setSearchQuery] = useState<string>()
  const [_isPending, startTransition] = useTransition()

  const candidates = useTextSearch(templates, searchQuery ?? '', ['name', 'nickName', 'keywords'], 'jw')

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

  const searchResults = candidates.slice(0, 4).reverse()

  useEffect(() => {
    const element = searchQueryInputRef.current

    if (!element) {
      return
    }

    queueMicrotask(() => {
      element.focus()
    })
  }, [])

  const [internalSelection, setInternalSelection] = useState<number>(3)
  const [preferHoverSelection, setPreferHoverSelection] = useState(false)
  const visibleSelection = preferHoverSelection ? null : internalSelection

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>): void => {
      switch (e.key) {
        case 'ArrowUp': {
          e.preventDefault()

          setInternalSelection(clamp(internalSelection - 1, 0, 3))

          break
        }
        case 'ArrowDown': {
          e.preventDefault()

          setInternalSelection(clamp(internalSelection + 1, 0, 3))

          break
        }
        case 'Enter': {
          if (preferHoverSelection) {
            return
          }

          handleAddNode(searchResults[internalSelection])

          break
        }
      }
    },
    [internalSelection, searchResults]
  )

  const handleAddNode = (template: NodePen.NodeTemplate): void => {
    const nodeInstance = createInstance(template)

    const nodeWidth = nodeInstance.dimensions.width
    const nodeHeight = nodeInstance.dimensions.height

    const [centerX, centerY] = overlaySpaceToWorldSpace(eventPosition.x, eventPosition.y)

    const nodePosition = {
      x: centerX - nodeWidth / 2,
      y: centerY - nodeHeight / 2,
    }

    nodeInstance.position = nodePosition

    apply((state) => {
      // Add node to document
      state.document.nodes[nodeInstance.instanceId] = nodeInstance

      // Clear menu from interface
      state.registry.contextMenus = {}
      state.registry.tooltips = {}

      // Expire solution
      expireSolution(state)
    })
  }

  const handlePointerEnterOptions = useCallback(() => {
    setPreferHoverSelection(true)
  }, [])

  const handlePointerLeaveOptions = useCallback(() => {
    // Remove any tooltips
    apply((state) => {
      delete state.registry.tooltips[KEYS.TOOLTIPS.ADD_NODE_MENU_OPTION_HOVER]
    })

    setPreferHoverSelection(false)
  }, [])

  return (
    <MenuBody position={menuPosition} animate={false}>
      <div onPointerEnter={handlePointerEnterOptions} onPointerLeave={handlePointerLeaveOptions}>
        {searchResults.map((template, i) => (
          <AddNodeButton
            key={`add-node-menu-entry-${i}-${template.guid}`}
            template={template}
            isSelected={i === visibleSelection}
            action={() => handleAddNode(template)}
          />
        ))}
      </div>
      <input
        ref={searchQueryInputRef}
        className="np-w-full np-h-8 np-pl-2 np-pr-2 np-mt-1 np-font-sans np-text-md np-text-dark np-text-left np-bg-pale np-shadow-input no-focus"
        type="text"
        onChange={debounceUpdateSearchQuery}
        onKeyDown={handleKeyDown}
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
