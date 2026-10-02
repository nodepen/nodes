import React, { useCallback, useState } from "react"
import type * as NodePen from '@/types'
import { useDispatch, useStore } from "@/store"
import { expireSolution } from '@/store/utils'
import { NodeInternalStateProvider, usePresenceState } from "../context/node-state"
import { useDebugRender, useDraggableNode, useSelectableNode } from "../hooks"
import { GenericNodeSkeleton } from "../generic-node/components"
import { ColorSwatchShadow } from "./components/ColorSwatchShadow"
import { ColorSwatchBody } from "./components/ColorSwatchBody"
import { ColorSwatchColor } from "./components/ColorSwatchColor"
import { ColorSwatchPorts } from "./components/ColorSwatchPorts"
import { GenericNodeWires } from "../wire"
import { usePageSpaceToOverlaySpace } from "@/hooks"
import { useRightClick } from "@/hooks/useRightClick"
import { useIsEditable } from "@/hooks/useIsEditable"
import { Dialog, ColorPicker } from "@/views/components"
import type { RGB } from "@/utils/color"
import { GenericParameterIcon } from "../generic-parameter/GenericParameterIcon"
import { ColorSwatchIcon } from "./components/ColorSwatchIcon"

type ColorSwatchProps = {
    id: string
    template: NodePen.NodeTemplate
}

const ColorSwatch = ({ id, template }: ColorSwatchProps) => {
    const node = useStore((store) => store.document.nodes[id])
    const internalState = usePresenceState(id)

    const isEditable = useIsEditable()

    useDebugRender(node, template)

    const { apply } = useDispatch()

    const pageSpaceToOverlaySpace = usePageSpaceToOverlaySpace()

    const draggableTargetRef = useDraggableNode(id)
    const selectableTargetRef = useSelectableNode(id)

    const [showColorPicker, setShowColorPicker] = useState(false)

    const handleDoubleClick = useCallback((e: React.MouseEvent<SVGGElement>) => {
        e.stopPropagation()

        if (!isEditable) {
            return
        }

        setShowColorPicker(true)
    }, [isEditable])

    const handleRightClick = useCallback((e: PointerEvent) => {
        e.stopPropagation()
        e.preventDefault()

        if (!isEditable) {
            return
        }

        const { pageX, pageY } = e

        const key = `color-swatch-menu-${id}`

        const [x, y] = pageSpaceToOverlaySpace(pageX + 6, pageY + 6)

        apply((state) => {
            state.registry.contextMenus[key] = {
                position: { x, y },
                context: {
                    type: 'color-swatch',
                    nodeInstanceId: id,
                }
            }
        })
    }, [isEditable, pageSpaceToOverlaySpace, id])

    const rightClickRef = useRightClick(handleRightClick, true)

    const handleCloseColorPicker = useCallback(() => {
        setShowColorPicker(false)
    }, [])

    const handleSubmitColor = useCallback((value: RGB) => {
        apply((state) => {
            const config = state.document.nodes[id]?.nodeConfiguration as NodePen.ColorSwatchConfig | undefined

            if (!config) {
                console.log(`🐍 Could not find config for color swatch ${id}`)
                return
            }

            config.r = value.r
            config.g = value.g
            config.b = value.b

            expireSolution(state)
        })
        setShowColorPicker(false)
    }, [id])

    if (!node) {
        return null
    }

    const config = node.nodeConfiguration as NodePen.ColorSwatchConfig

    return (
        <NodeInternalStateProvider value={internalState}>
            <g id={`color-swatch-${id}`} style={{ pointerEvents: 'all' }} ref={rightClickRef} onDoubleClick={handleDoubleClick}>
                <g ref={draggableTargetRef}>
                    <g ref={selectableTargetRef}>
                        {node.status.isProvisional ? (
                            <GenericNodeSkeleton node={node} template={template} />
                        ) : (<>
                            <ColorSwatchShadow node={node} />
                            <ColorSwatchBody node={node} />
                            <ColorSwatchColor node={node} />
                        </>)}
                    </g>
                </g>
                {!node.status.isProvisional ? (
                    <ColorSwatchPorts node={node} template={template} />
                ) : null}
            </g>
            {showColorPicker ? (
                <Dialog onClose={handleCloseColorPicker}>
                    <ColorPicker value={{ r: config.r, g: config.g, b: config.b }} onSubmit={handleSubmitColor} onClose={handleCloseColorPicker} />
                </Dialog>
            ) : null}
            <GenericNodeWires node={node} />
        </NodeInternalStateProvider>
    )
}

export default React.memo(ColorSwatch, (prev, next) => prev.id === next.id)
