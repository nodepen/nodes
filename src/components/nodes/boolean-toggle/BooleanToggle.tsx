import React, { useCallback } from "react"
import type * as NodePen from '@/types'
import { useDispatch, useStore } from "@/store"
import { expireSolution } from '@/store/utils'
import { NodeInternalStateProvider, usePresenceState } from "../context/node-state"
import { useDebugRender, useDraggableNode, useSelectableNode } from "../hooks"
import { GenericNodeSkeleton } from "../generic-node/components"
import { BooleanToggleShadow } from "./components/BooleanToggleShadow"
import { BooleanToggleBody } from "./components/BooleanToggleBody"
import { BooleanToggleLabel } from "./components/BooleanToggleLabel"
import { BooleanToggleSwitch } from "./components/BooleanToggleSwitch"
import { BooleanTogglePorts } from "./components/BooleanTogglePorts"
import { GenericNodeWires } from "../wire"
import { usePageSpaceToOverlaySpace } from "@/hooks"
import { useRightClick } from "@/hooks/useRightClick"
import { getBooleanTogglePortTemplate } from "@/utils/templates/getGenericParameterDefinition"
import { useIsEditable } from "@/hooks/useIsEditable"

type BooleanToggleProps = {
    id: string
    template: NodePen.NodeTemplate
}

const BooleanToggle = ({ id, template }: BooleanToggleProps) => {
    const node = useStore((store) => store.document.nodes[id])
    const internalState = usePresenceState(id)

    const isEditable = useIsEditable()

    useDebugRender(node, template)

    const { apply } = useDispatch()

    const pageSpaceToOverlaySpace = usePageSpaceToOverlaySpace()

    const draggableTargetRef = useDraggableNode(id)
    const selectableTargetRef = useSelectableNode(id)

    const handleToggleClick = useCallback((e: React.MouseEvent<SVGGElement>): void => {
        if (e.button !== 0) {
            return
        }

        e.stopPropagation()

        if (!isEditable) {
            return
        }

        apply((state) => {
            const config = state.document.nodes[id].nodeConfiguration as NodePen.BooleanToggleConfig

            if (!config) {
                console.log(`🐍 Could not find config for boolean toggle ${id}`)
                return
            }

            config.value = !config.value

            expireSolution(state)
        })
    }, [isEditable, apply, id])

    const handleRightClick = useCallback((e: PointerEvent) => {
        e.stopPropagation()
        e.preventDefault()

        if (!isEditable) {
            return
        }

        const { pageX, pageY } = e

        const key = `boolean-toggle-menu-${node.instanceId}`

        const [x, y] = pageSpaceToOverlaySpace(pageX + 6, pageY + 6)

        apply((state) => {
            state.registry.contextMenus[key] = {
                position: {
                    x: x + 3,
                    y: y + 3,
                },
                context: {
                    type: 'port',
                    direction: 'input',
                    portTemplate: getBooleanTogglePortTemplate(template, 'input'),
                    nodeInstanceId: id,
                    portInstanceId: 'input'
                }
            }
        })
    }, [isEditable])

    const rightClickRef = useRightClick(handleRightClick, true)

    if (!node) {
        return null
    }

    return (
        <NodeInternalStateProvider value={internalState}>
            <g id={`boolean-toggle-${id}`} style={{ pointerEvents: 'all' }} ref={rightClickRef}>
                <g ref={draggableTargetRef}>
                    <g ref={selectableTargetRef}>
                        {node.status.isProvisional ? (
                            <GenericNodeSkeleton node={node} template={template} />
                        ) : (<>
                            <BooleanToggleShadow node={node} />
                            <BooleanToggleBody node={node} />
                            <BooleanToggleLabel node={node} />
                        </>)}
                    </g>
                </g>
                {!node.status.isProvisional ? (<>
                    <BooleanToggleSwitch node={node} onClick={handleToggleClick} />
                    <BooleanTogglePorts node={node} template={template} />
                </>) : null}
            </g>
            <GenericNodeWires node={node} />
        </NodeInternalStateProvider>
    )
}

export default React.memo(BooleanToggle, (prev, next) => prev.id === next.id)
