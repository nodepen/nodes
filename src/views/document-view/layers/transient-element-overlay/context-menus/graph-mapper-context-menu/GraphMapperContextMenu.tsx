import React, { useCallback } from 'react'
import type * as NodePen from '@/types'
import type { ContextMenu } from '../../types'
import type { GraphMapperContextMenuContext } from '../../types/ContextMenuContext'
import { MenuBody, MenuButton, MenuDivider, MenuHeader } from '../../common'
import { getIconAsImage, applyFallbackIcon } from '@/utils/templates'
import { useDispatch, useStore } from '$'
import { STYLES } from '@/constants'
import { expireSolution } from '@/store/utils'

const GRAPH_TYPE_OPTIONS: { graphType: NodePen.GraphMapperGraphType; label: string }[] = [
    { graphType: 'linear', label: 'Linear' },
    { graphType: 'bezier', label: 'Bezier' },
]

type GraphMapperContextMenuProps = {
    position: ContextMenu['position']
    context: GraphMapperContextMenuContext
}

const GraphMapperContextMenu = ({ position, context }: GraphMapperContextMenuProps) => {
    const { nodeInstanceId } = context

    const { apply, clearInterface } = useDispatch()

    const template = useStore((state) => {
        const node = state.document.nodes[nodeInstanceId]
        return node ? state.templates[node.templateId] : undefined
    })

    const currentGraphType = useStore((state) => {
        const config = state.document.nodes[nodeInstanceId]?.nodeConfiguration as NodePen.GraphMapperConfig | undefined
        return config?.graphType ?? null
    })

    const handleSelectGraphType = useCallback((graphType: NodePen.GraphMapperGraphType) => {
        apply((state) => {
            const config = state.document.nodes[nodeInstanceId]?.nodeConfiguration as NodePen.GraphMapperConfig | undefined

            if (!config) {
                console.log(`🐍 Could not find config for graph mapper ${nodeInstanceId}`)
                return
            }

            if (config.graphType === graphType) {
                return
            }

            config.graphType = graphType

            switch (graphType) {
                case 'linear': {
                    config.grips = [
                        { x: 0.45, y: 0.90 },
                        { x: 0.75, y: 0.75 }
                    ]
                    break
                }
                case 'bezier': {
                    config.grips = [
                        { x: 0, y: 0 },
                        { x: 0.25, y: 0.25 },
                        { x: 0.75, y: 0.75 },
                        { x: 1, y: 1 }
                    ]
                    break
                }
                default: {
                    config.grips = []
                }
            }

            expireSolution(state)
        })
        clearInterface()
    }, [nodeInstanceId])

    const checkIcon = (
        <svg {...STYLES.BUTTON.SMALL} strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
    )

    return (
        <MenuBody position={position}>
            {template ? (
                <>
                    <MenuHeader
                        icon={
                            <img
                                width={20}
                                height={20}
                                src={getIconAsImage(template)}
                                onError={applyFallbackIcon}
                                alt={`${template.name} (${template.nickName}): ${template.description}`}
                            />
                        }
                        label={template.name}
                    />
                    <MenuDivider />
                </>
            ) : null}
            {GRAPH_TYPE_OPTIONS.map(({ graphType, label }) => {
                const isSelected = currentGraphType === graphType

                return (
                    <MenuButton
                        key={`graph-type-${graphType}`}
                        icon={isSelected ? checkIcon : null}
                        label={label}
                        isSelected={isSelected}
                        action={() => { handleSelectGraphType(graphType) }}
                    />
                )
            })}
        </MenuBody>
    )
}

export default React.memo(GraphMapperContextMenu)
