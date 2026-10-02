import React, { useCallback } from "react"
import type * as NodePen from '@/types'
import { useDispatch, useStore } from "@/store"
import { NodeInternalStateProvider, usePresenceState } from "../context/node-state"
import { useDebugRender, useDraggableNode, useSelectableNode } from "../hooks"
import { GenericNodeSkeleton } from "../generic-node/components"
import { ValueListShadow } from "./components/ValueListShadow"
import { ValueListBody } from "./components/ValueListBody"
import { ValueListInput } from "./components/ValueListInput"
import { ValueListPorts } from "./components/ValueListPorts"
import { GenericNodeWires } from "../wire"
import { useLongHover, usePageSpaceToOverlaySpace } from "@/hooks"
import { useRightClick } from "@/hooks/useRightClick"
import { useIsEditable } from "@/hooks/useIsEditable"

type ValueListProps = {
    id: string
    template: NodePen.NodeTemplate
}

const ValueList = ({ id, template }: ValueListProps) => {
    const node = useStore((store) => store.document.nodes[id])
    const internalState = usePresenceState(id)

    const isEditable = useIsEditable()

    useDebugRender(node, template)

    const { apply } = useDispatch()
    const pageSpaceToOverlaySpace = usePageSpaceToOverlaySpace()

    const draggableTargetRef = useDraggableNode(id)
    const selectableTargetRef = useSelectableNode(id)

    const handleLongHover = useCallback((e: PointerEvent): void => {
        // const { pageX, pageY } = e

        // const [x, y] = pageSpaceToOverlaySpace(pageX, pageY)

        // apply((state) => {
        //     state.registry.tooltips[`graph-node-${id}`] = {
        //         configuration: {
        //             position: {
        //                 x: x + 8,
        //                 y: y + 8,
        //             },
        //             isSticky: false,
        //         },
        //         context: {
        //             type: 'node-template-summary',
        //             template,
        //         },
        //     }
        // })
    }, [pageSpaceToOverlaySpace, id, template])

    const longHoverTarget = useLongHover<SVGGElement>(handleLongHover)

    const handleRightClick = useCallback((e: PointerEvent): void => {
        e.stopPropagation()

        if (!isEditable) {
            return
        }

        const { pageX, pageY } = e
        const key = `value-list-context-menu-${id}`

        const [x, y] = pageSpaceToOverlaySpace(pageX + 6, pageY + 6)

        apply((state) => {
            state.registry.contextMenus[key] = {
                position: { x, y },
                context: {
                    type: 'value-list',
                    nodeInstanceId: id,
                }
            }
        })
    }, [isEditable, pageSpaceToOverlaySpace, id])

    const rightClickRef = useRightClick(handleRightClick, true)

    const handleInputClick = useCallback((e: React.MouseEvent<SVGGElement>): void => {
        if (e.button !== 0) {
            return
        }

        e.stopPropagation()

        if (!isEditable) {
            return
        }

        const { pageX, pageY } = e
        const key = `value-list-options-context-menu-${id}`

        const [x, y] = pageSpaceToOverlaySpace(pageX + 6, pageY + 6)

        apply((state) => {
            state.registry.contextMenus[key] = {
                position: { x, y },
                context: {
                    type: 'value-list-options',
                    nodeInstanceId: id,
                }
            }
        })
    }, [isEditable, pageSpaceToOverlaySpace, id])

    if (!node) {
        return null
    }

    return (
        <NodeInternalStateProvider value={internalState}>
            <g id={`value-list-${id}`} ref={rightClickRef} style={{ pointerEvents: 'all' }}>
                <g ref={draggableTargetRef}>
                    <g ref={selectableTargetRef}>
                        {node.status.isProvisional ? (
                            <GenericNodeSkeleton node={node} template={template} />
                        ) : (<>
                            <ValueListShadow node={node} />
                            <ValueListBody node={node} />
                        </>)}
                    </g>
                </g>
                {!node.status.isProvisional ? (<>
                    <ValueListInput node={node} onClick={handleInputClick} />
                    <ValueListPorts node={node} template={template} />
                </>) : null}
            </g>
            <GenericNodeWires node={node} />
        </NodeInternalStateProvider>

    )
}

export default React.memo(ValueList, (prev, next) => prev.id === next.id)
