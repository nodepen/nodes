import React, { useCallback, useState, useTransition, useRef, useEffect, useMemo } from 'react'
import type * as NodePen from '@/types'
import { useDispatch, useStore } from '$'
import type { ContextMenu } from '../../types'
import { MenuBody } from '../../common'
import { clamp } from '@/utils/numerics'
import { createInstance } from '@/utils/templates'
import { useTextSearch } from './hooks'
import { useOverlaySpaceToWorldSpace } from '@/hooks'
import { AddNodeButton, ShortcutMatchInfo } from './components'
import { COMPONENTS, KEYS } from '@/constants'
import { expireSolution } from '@/store/utils'
import { createSingleValue } from '@/utils/data-trees/createSingleValue'
import { tryMatchTextSearch } from '@/utils/templates/tryMatchTextSearch'

type AddNodeContextMenuProps = {
    position: ContextMenu['position']
}

export const AddNodeContextMenu = ({ position: eventPosition }: AddNodeContextMenuProps) => {
    const templates = useStore((state) => Object.values(state.templates))
    const { apply } = useDispatch()

    const overlaySpaceToWorldSpace = useOverlaySpaceToWorldSpace()

    const numberSlider = useMemo(() => templates.find((template) => template.guid === COMPONENTS.NUMBER_SLIDER), [templates])

    const menuPosition = {
        x: eventPosition.x - 192 / 2,
        y: eventPosition.y - 185 - 5,
    }

    const searchQueryInputRef = useRef<HTMLInputElement>(null)
    const [searchQuery, setSearchQuery] = useState<string>()

    const [activeSearchQuery, setActiveSearchQuery] = useState<string>()

    const candidates = useTextSearch(templates, activeSearchQuery ?? '', ['name', 'nickName'], 'jw')
    const keywordMatches = useMemo(() => {
        return templates.filter((template) => template.keywords.some((keyword) => keyword.toLowerCase() === activeSearchQuery?.toLowerCase()))
    }, [activeSearchQuery])

    const updateSearchQuery = useCallback(() => {
        const element = searchQueryInputRef.current

        if (!element) {
            return
        }

        setSearchQuery(element.value)
    }, [])

    const updateActiveSearchQuery = useCallback(() => {
        setActiveSearchQuery(searchQuery)
    }, [searchQuery])
    const debounceUpdateActiveSearchQuery = useDebounceCallback(updateActiveSearchQuery, 200)

    useEffect(() => {
        debounceUpdateActiveSearchQuery()
    }, [searchQuery])

    const shortcutMatch = useMemo(() => {
        return tryMatchTextSearch(searchQuery ?? '')
    }, [searchQuery, templates])

    const handleAddNodeFromShortcut = useCallback(() => {
        if (!shortcutMatch) {
            return
        }

        const template = templates.find((t) => t.guid === shortcutMatch.templateId)

        if (!template) {
            return
        }

        let node: NodePen.DocumentNode | null = null

        switch (shortcutMatch.type) {
            case 'panel': {
                node = createInstance(template)
                node.nodeConfiguration = shortcutMatch.config

                if (shortcutMatch.config.textContent?.length && shortcutMatch.config.textContent.length < 5) {
                    node.dimensions.width = 100
                    node.dimensions.height = 40
                    node.anchors['input'] = {
                        dx: 0,
                        dy: node.dimensions.height / 2
                    }
                    node.anchors['output'] = {
                        dx: node.dimensions.width,
                        dy: node.dimensions.height / 2
                    }
                }

                break
            }
            case 'number-slider': {
                node = createInstance(template)
                node.values['output'] = createSingleValue(shortcutMatch.value, 'number')
                node.nodeConfiguration = shortcutMatch.config

                break
            }
            case 'addition':
            case 'subtraction':
            case 'multiplication':
            case 'division': {
                node = createInstance(template)

                if (shortcutMatch.value) {
                    const inputInstanceId = Object.entries(node.inputs).find(([, i]) => i === 1)?.[0]

                    if (!inputInstanceId) {
                        console.log('🐍 Could not find input param for math component!')
                        break
                    }

                    node.values[inputInstanceId] = createSingleValue(shortcutMatch.value, 'number')
                }
            }
        }

        if (!node) {
            console.log(`Failed to create node from shortcut!`)
            return
        }

        const [centerX, centerY] = overlaySpaceToWorldSpace(eventPosition.x, eventPosition.y)

        const nodePosition = {
            x: centerX - node.dimensions.width / 2,
            y: centerY - node.dimensions.height / 2,
        }

        node.position = nodePosition

        apply((state) => {
            // Add node to document
            state.document.nodes[node.instanceId] = node

            // Clear menu from interface
            state.registry.contextMenus = {}
            state.registry.tooltips = {}

            // Expire solution
            expireSolution(state)
        })
    }, [shortcutMatch, templates])

    const searchResults = useMemo(() => {
        return [...keywordMatches, ...candidates].slice(0, 4).reverse()
        // return candidates.slice(0, 4).reverse()
    }, [candidates])

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
            e.stopPropagation()
            e.nativeEvent.stopImmediatePropagation()

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
                    if (shortcutMatch) {
                        handleAddNodeFromShortcut()
                        return
                    }

                    if (preferHoverSelection) {
                        return
                    }

                    handleAddNode(searchResults[internalSelection] ?? searchResults.at(0))

                    break
                }
            }
        },
        [internalSelection, searchResults, handleAddNodeFromShortcut]
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
            {
                !!shortcutMatch
                    ? <>
                        <AddNodeButton
                            key={`add-node-shortcut`}
                            template={templates.find((t) => t.guid === shortcutMatch.templateId)!}
                            isSelected={false}
                            action={() => ''}
                        />
                        <ShortcutMatchInfo match={shortcutMatch} />
                    </>
                    : <div onPointerEnter={handlePointerEnterOptions} onPointerLeave={handlePointerLeaveOptions}>
                        {searchResults.map((template, i) => (
                            <AddNodeButton
                                key={`add-node-menu-entry-${i}-${template.guid}`}
                                template={template}
                                isSelected={i === visibleSelection}
                                action={() => handleAddNode(template)}
                            />
                        ))}
                    </div>}
            <input
                ref={searchQueryInputRef}
                className="np-w-full np-h-8 np-pl-2 np-pr-2 np-mt-1 np-font-sans np-text-md np-text-dark np-text-left np-bg-pale np-shadow-input no-focus"
                type="text"
                onChange={updateSearchQuery}
                onKeyDown={handleKeyDown}
            />
        </MenuBody>
    )
}

const useDebounceCallback = (callback: () => void, delay: number): (() => void) => {
    const internalTimeout = useRef<ReturnType<typeof setTimeout>>(undefined)

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
