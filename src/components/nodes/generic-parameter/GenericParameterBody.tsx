import React, { useCallback, useRef } from 'react'
import type * as NodePen from '@/types'
import { useDispatch, useStore } from '$'
import { COLORS, COMPONENTS } from '@/constants'
import { useLongHover, usePageSpaceToOverlaySpace } from '@/hooks'
import { getGenericParameterPortTemplate } from '@/utils/templates/getGenericParameterDefinition'
import { getPortContextMenuKey } from '@/utils/keys/getPortContextMenuKey'
import { useSelectionColor } from '@/hooks/useSelectionColor'
import { useNodeInternalState } from '../context/node-state'
import { useIsEditable } from '@/hooks/useIsEditable'
import { useRightClick } from '@/hooks/useRightClick'

type GenericParameterBodyProps = {
    node: NodePen.DocumentNode
    template: NodePen.NodeTemplate
}

export const GenericParameterBody = ({ node, template }: GenericParameterBodyProps) => {
    const { position } = useNodeInternalState()

    const isEditable = useIsEditable()

    const { width, height } = node.dimensions

    const { apply } = useDispatch()
    const pageSpaceToOverlaySpace = usePageSpaceToOverlaySpace()

    const { sessionColor, presenceColor } = useSelectionColor(node.instanceId)

    const lastPointerType = useRef<'mouse' | 'pen' | 'touch'>('mouse')
    const handlePointerDown = useCallback((e: React.PointerEvent<SVGGElement>): void => {
        lastPointerType.current = e.pointerType
    }, [])

    const handleContextMenu = useCallback((e: PointerEvent): void => {
        e.stopPropagation()
        e.preventDefault()

        if (!isEditable) {
            return
        }

        if (lastPointerType.current !== 'mouse') {
            return
        }

        const { pageX, pageY } = e

        const key = getPortContextMenuKey(node.instanceId, 'input')

        const [x, y] = pageSpaceToOverlaySpace(pageX + 6, pageY + 6)

        if (template.guid === COMPONENTS.COLOR) {
            apply((state) => {
                state.registry.contextMenus[key] = {
                    position: { x, y },
                    context: {
                        type: 'color-parameter',
                        nodeInstanceId: node.instanceId,
                        portInstanceId: 'input',
                    }
                }
            })
            return
        }

        apply((state) => {
            state.registry.contextMenus[key] = {
                position: { x, y },
                context: {
                    type: 'port',
                    direction: 'input',
                    nodeInstanceId: node.instanceId,
                    portInstanceId: 'input',
                    portTemplate: getGenericParameterPortTemplate(template, 'input')
                }
            }
        })
    }, [isEditable])

    const rightClickRef = useRightClick(handleContextMenu, true)

    const handleLongHover = useCallback((e: PointerEvent): void => {
        const { pageX, pageY } = e

        const [x, y] = pageSpaceToOverlaySpace(pageX, pageY)

        apply((state) => {
            state.registry.tooltips[`port-tooltip-param-${node.instanceId}`] = {
                configuration: {
                    position: {
                        x: x + 8,
                        y: y + 8,
                    },
                    isSticky: false
                },
                context: {
                    type: 'port',
                    nodeInstanceId: node.instanceId,
                    portInstanceId: 'output',
                    template: getGenericParameterPortTemplate(template, 'output'),
                }
            }
        })
    }, [])

    const longHoverTarget = useLongHover<SVGGElement>(handleLongHover)

    return (
        <g id={`generic-param-body-${node.instanceId}`} ref={longHoverTarget} onPointerDown={handlePointerDown}>
            <g ref={rightClickRef}>
                <rect
                    x={position.x}
                    y={position.y}
                    width={width}
                    height={height}
                    rx={7}
                    ry={7}
                    fill={presenceColor ?? sessionColor}
                    stroke={COLORS.DARK}
                    strokeWidth={2}
                    pointerEvents="auto"
                />
            </g>
        </g>
    )
}