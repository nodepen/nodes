import React, { useCallback, useState, useTransition, useRef, useEffect, useMemo } from 'react'
import type * as NodePen from '@/types'
import { useDispatch, useStore } from '$'
import { shallow } from 'zustand/shallow'
import type { ContextMenu } from '../../types'
import { clamp } from '@/utils/numerics'
import { createInstance, getIconAsImage } from '@/utils/templates'
import { useTextSearch } from './hooks'
import { useOverlaySpaceToWorldSpace } from '@/hooks'
import { COMPONENTS, KEYS } from '@/constants'
import { expireSolution, addDocumentNode } from '@/store/utils'
import { createSingleValue } from '@/utils/data-trees/createSingleValue'
import { tryMatchTextSearch, type TemplateMatch } from '@/utils/templates/tryMatchTextSearch'
import { AgentIcon } from '@/components/icons/AgentIcon'
import { newGuid } from '@/utils/common'
import { current } from 'immer'
import { useFeatureFlag } from '@/hooks/useFeatureFlag'

type AddNodeContextMenuProps = {
    position: ContextMenu['position']
}

type SearchOption =
    | {
        type: 'add-node'
        template: NodePen.NodeTemplate
    }
    | {
        type: 'add-shortcut'
        match: TemplateMatch
    }
    | {
        type: 'agent-action'
        action: 'ask' | 'edit'
    }

export const AddNodeContextMenu = ({ position: eventPosition }: AddNodeContextMenuProps) => {
    const templates = useStore((state) => Object.values(state.templates), shallow)
    const preferences = useStore((state) => state.ui.preferences)
    const { apply } = useDispatch()

    const enableAgent = useFeatureFlag('enableAgentButton')

    const overlaySpaceToWorldSpace = useOverlaySpaceToWorldSpace()

    const numberSlider = useMemo(() => templates.find((template) => template.guid === COMPONENTS.NUMBER_SLIDER), [templates])

    const menuWidth = 300
    const menuHeight = 40
    const menuPosition = {
        x: eventPosition.x - (menuWidth / 2),
        y: eventPosition.y - (menuHeight / 2) - 2,
    }

    const searchQueryInputRef = useRef<HTMLInputElement>(null)
    const [searchQuery, setSearchQuery] = useState<string>()

    const [activeSearchQuery, setActiveSearchQuery] = useState<string>()

    const candidates = useTextSearch(templates, activeSearchQuery ?? '', ['name', 'nickName'], 'dice', 0.7)
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

                if (shortcutMatch.config.textContent?.length && shortcutMatch.config.textContent.length < 8) {
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
            case 'point': {
                node = createInstance(template)
                const [x, y, z] = shortcutMatch.value

                node.values['input'] = createSingleValue(`${x},${y},${z}`, 'point')

                break
            }
            case 'number-slider': {
                node = createInstance(template)
                node.values['input'] = createSingleValue(shortcutMatch.value, 'number')
                node.nodeConfiguration = shortcutMatch.config

                break
            }
            case 'addition':
            case 'subtraction':
            case 'multiplication':
            case 'division': {
                node = createInstance(template, preferences)

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
            addDocumentNode(state, node)

            // Clear menu from interface
            state.registry.contextMenus = {}
            state.registry.tooltips = {}

            // Expire solution
            expireSolution(state)
        })
    }, [shortcutMatch, templates])

    const searchResults = useMemo(() => {
        return [...keywordMatches, ...candidates].slice(0, 4)
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

    const [internalSelection, setInternalSelection] = useState<number>(0)
    const [preferHoverSelection, setPreferHoverSelection] = useState(false)
    const visibleSelection = preferHoverSelection ? null : internalSelection

    const currentOptions: SearchOption[] = searchQuery?.length && activeSearchQuery?.length ?
        !!shortcutMatch ? [
            // Shortcut result
            {
                type: 'add-shortcut',
                match: shortcutMatch
            },
            ...(activeSearchQuery.length > 10 ? [
                {
                    type: 'agent-action' as const,
                    action: 'ask' as const
                },
                {
                    type: 'agent-action' as const,
                    action: 'edit' as const
                }
            ] : [])
        ] :
            (searchResults.length && activeSearchQuery && activeSearchQuery.length < 14) ?
                // Normal results
                searchResults.map((template) => ({
                    type: 'add-node',
                    template
                })) :
                enableAgent ? [
                    // Agent options
                    {
                        type: 'agent-action',
                        action: 'ask'
                    },
                    {
                        type: 'agent-action',
                        action: 'edit'
                    }
                ] : [] : [
            // No options
        ]

    const handleAddNode = (template: NodePen.NodeTemplate): void => {
        const nodeInstance = createInstance(template, preferences)

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
            addDocumentNode(state, nodeInstance)

            // Clear menu from interface
            state.registry.contextMenus = {}
            state.registry.tooltips = {}

            // Expire solution
            expireSolution(state)
        })
    }

    const handleSelectOption = useCallback((option: SearchOption) => {
        switch (option.type) {
            case 'add-node': {
                handleAddNode(option.template)
                break
            }
            case 'add-shortcut': {
                handleAddNodeFromShortcut()
                break
            }
            case 'agent-action': {
                const { action } = option

                const bubbleId = newGuid()

                apply((state) => {
                    state.ui.search.action = action === 'ask' ? 'agent-ask' : 'agent-edit'
                    state.ui.search.actionId = bubbleId

                    const [x, y] = overlaySpaceToWorldSpace(eventPosition.x, eventPosition.y)

                    state.registry.agent.bubbles[bubbleId] = {
                        type: action,
                        ref: React.createRef<HTMLDivElement>(),
                        message: activeSearchQuery ?? '',
                        position: { x, y }
                    }

                    // Clear menu from interface
                    state.registry.contextMenus = {}
                    state.registry.tooltips = {}

                    state.callbacks.onSubmitSearch?.(current(state))
                })
                break
            }
        }
    }, [handleAddNode, handleAddNodeFromShortcut, activeSearchQuery, eventPosition])

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
                    if (preferHoverSelection) {
                        return
                    }

                    const selectedOption = currentOptions[internalSelection]

                    if (!selectedOption) {
                        return
                    }

                    handleSelectOption(selectedOption)

                    break
                }
            }
        },
        [internalSelection, searchResults, handleAddNodeFromShortcut, currentOptions, handleSelectOption, preferHoverSelection]
    )

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

    return <div className='np-absolute np-p-0.5 np-rounded-[22px] np-flex np-flex-col np-items-center np-bg-light np-shadow-main np-pointer-events-auto' style={{ width: `${menuWidth}px`, left: `${menuPosition.x}px`, top: `${menuPosition.y}px` }}>
        <input
            ref={searchQueryInputRef}
            placeholder='Search or ask a question...'
            className={`np-w-full np-h-10 np-pl-3 np-pr-3 np-rounded-full np-font-sans np-text-sm np-text-dark np-border-2 np-border-dark np-text-left np-bg-white no-focus`}
            type="text"
            onChange={updateSearchQuery}
            onKeyDown={handleKeyDown}
        />
        <div className='np-w-full np-flex np-flex-col np-items-center' onPointerEnter={handlePointerEnterOptions} onPointerLeave={handlePointerLeaveOptions}>
            {currentOptions.map((option, i) => {
                return <SearchEntry key={`${option.type}-${i}`} option={option} isSelected={i === visibleSelection} onClick={() => handleSelectOption(option)} />
            })}
        </div>
    </div>

    // return (
    //     <MenuBody position={menuPosition} animate={false}>
    //         {
    //             !!shortcutMatch
    //                 ? <>
    //                     <AddNodeButton
    //                         key={`add-node-shortcut`}
    //                         template={templates.find((t) => t.guid === shortcutMatch.templateId)!}
    //                         isSelected={false}
    //                         action={handleAddNodeFromShortcut}
    //                     />
    //                     <ShortcutMatchInfo match={shortcutMatch} />
    //                 </>
    //                 : <div onPointerEnter={handlePointerEnterOptions} onPointerLeave={handlePointerLeaveOptions}>
    //                     {searchResults.map((template, i) => (
    //                         <AddNodeButton
    //                             key={`add-node-menu-entry-${i}-${template.guid}`}
    //                             template={template}
    //                             isSelected={i === visibleSelection}
    //                             action={() => handleAddNode(template)}
    //                         />
    //                     ))}
    //                 </div>}

    //     </MenuBody>
    // )
}

type SearchEntryProps = {
    option: SearchOption
    isSelected: boolean
    onClick: () => void
}

const SearchEntry = ({ option, isSelected, onClick }: SearchEntryProps) => {
    const emptyMessage = useMemo(() => {
        const messages = [
            'Limitless potential!',
            'Could be anything!',
            'How mysterious!',
            'What happens now?'
        ]

        const selectedMessage = messages[Math.floor(Math.random() * messages.length)]

        return selectedMessage
    }, [])

    const getIcon = () => {
        switch (option.type) {
            case 'add-node': {
                const { icon } = option.template
                return <img src={getIconAsImage(option.template)} />
            }
            case 'add-shortcut': {
                const { type, templateId } = option.match

                const template = useStore.getState().templates[templateId]

                if (!template) {
                    return ''
                }

                return <img src={getIconAsImage(template)} />
            }
            case 'agent-action': {
                return <AgentIcon />
            }
            default: {
                return null
            }
        }
    }

    const getLabel = () => {
        switch (option.type) {
            case 'add-node': {
                const { name } = option.template
                return name
            }
            case 'add-shortcut': {
                const { type, templateId } = option.match

                const template = useStore.getState().templates[templateId]

                if (!template) {
                    return ''
                }

                return template.name
            }
            case 'agent-action': {
                return option.action === 'ask' ? 'Ask a question...' : 'Ask to make something...'
            }
        }
    }

    const getDetails = () => {
        switch (option.type) {
            case 'add-node': {
                const { category, subcategory } = option.template
                return `${category} - ${subcategory}`
            }
            case 'add-shortcut': {
                const { type, templateId } = option.match

                switch (type) {
                    case 'panel': {
                        const { textContent } = option.match.config
                        const isSmall = textContent?.length ?? 0 < 8

                        return textContent?.length ? `A${isSmall ? ' small' : ''} panel that says: ${textContent}` : `An empty panel. ${emptyMessage}`
                    }
                    case 'number-slider': {
                        const { min, max, precision } = option.match.config

                        return `Value: ${option.match.value} - Domain: ${min} to ${max} - Precision: ${precision}`
                    }
                    case 'point': {
                        const [x, y, z] = option.match.value

                        return `Coordinates: ${x}, ${y}, ${z}`
                    }
                    case 'addition':
                    case 'subtraction':
                    case 'multiplication':
                    case 'division': {
                        const { value } = option.match

                        const messages = {
                            'addition': 'Add',
                            'subtraction': 'Subtract',
                            'multiplication': 'Multiply by',
                            'division': 'Divide by'
                        }

                        if (!value) {
                            return `${messages[type].replace(' by', '')} two numbers`
                        }

                        return `${messages[type]} ${value}`
                    }
                    default: {
                        const template = useStore.getState().templates[templateId]

                        if (!template) {
                            return ''
                        }

                        const { category, subcategory } = template

                        return `${category} - ${subcategory}`
                    }
                }

            }
            case 'agent-action': {
                switch (option.action) {
                    case 'ask': {
                        return 'Agent will give you some tips.'
                    }
                    case 'edit': {
                        return 'Agent will join you in the document.'
                    }
                }
            }
        }
    }

    return <div className={`${isSelected ? 'np-bg-grey' : ''} np-w-full np-flex np-items-center np-mt-0.5 np-px-2 np-py-1 np-rounded-[20px] hover:np-bg-grey hover:np-cursor-pointer np-pointer-events-auto`} onClick={onClick}>
        <div className='np-w-8 np-h-8 np-mr-1 np-flex np-items-center np-justify-center'>
            {getIcon()}
        </div>
        <div className='np-grow np-ml-1 np-flex np-flex-col np-items-start np-justify-center'>
            <p className="np-text-sm np-text-dark np-font-panel">{getLabel()}</p>
            <p className='np-text-xs np-text-dark np-font-panel'>{getDetails()}</p>
        </div>
    </div>
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
