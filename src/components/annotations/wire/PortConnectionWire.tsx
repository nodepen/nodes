import React, { useCallback, useRef } from 'react'
import type * as NodePen from '@/types'
import type { NodePortReference } from '@/types'
import { useNodeAnchorPosition, usePageSpaceToWorldSpace, usePortValues } from '@/hooks'
import { useIsEditable } from '@/hooks/useIsEditable'
import { useDispatch, useStore } from '$'
import { COMPONENTS } from '@/constants'
import { createInstance } from '@/utils/templates'
import { addDocumentNode, expireSolution } from '@/store/utils'
import { WirePortal, WiresMaskPortal } from './components'
import { Wire } from './Wire'

type PortConnectionWireProps = {
    from: NodePortReference
    to: NodePortReference
}

/** Draws a wire between two node port references based on their position and the source's data structure. */
const PortConnectionWire = ({ from, to }: PortConnectionWireProps): React.ReactElement | null => {
    const { nodeInstanceId: fromNodeId, portInstanceId: fromPortId } = from
    const { nodeInstanceId: toNodeId, portInstanceId: toPortId } = to

    const fromPosition = useNodeAnchorPosition(fromNodeId, fromPortId)
    const toPosition = useNodeAnchorPosition(toNodeId, toPortId)

    const isSelected = useStore((state) => {
        const selection = state.registry.selection.nodes
        return selection.includes(fromNodeId) || selection.includes(toNodeId)
    })

    const sourceDataTree = usePortValues(fromNodeId, fromPortId)

    const previousStructure = useRef<NodePen.DataTreeStructure>('single')

    const isEditable = useIsEditable()
    const { apply } = useDispatch()
    const pageSpaceToWorldSpace = usePageSpaceToWorldSpace()

    const handleDoubleClick = useCallback((e: React.MouseEvent<SVGPathElement>): void => {
        e.stopPropagation()

        console.log('!!')

        if (!isEditable) {
            return
        }

        // Create a relay
        const template = useStore.getState().templates[COMPONENTS.RELAY]

        if (!template) {
            console.log(`🐍 Could not find a template for the relay component`)
            return
        }

        const relay = createInstance(template)

        const [worldX, worldY] = pageSpaceToWorldSpace(e.pageX, e.pageY)

        relay.position = {
            x: worldX - relay.dimensions.width / 2,
            y: worldY - relay.dimensions.height / 2,
        }

        relay.sources['input'] = [{ nodeInstanceId: fromNodeId, portInstanceId: fromPortId }]

        apply((state) => {
            addDocumentNode(state, relay)

            const targetNode = state.document.nodes[toNodeId]

            if (!targetNode) {
                return
            }

            targetNode.sources[toPortId] = (targetNode.sources[toPortId] ?? []).map((source) =>
                source.nodeInstanceId === fromNodeId && source.portInstanceId === fromPortId
                    ? { nodeInstanceId: relay.instanceId, portInstanceId: 'output' }
                    : source
            )

            expireSolution(state)
        })
    }, [isEditable, apply, pageSpaceToWorldSpace, fromNodeId, fromPortId, toNodeId, toPortId])

    if (!fromPosition || !toPosition) {
        return null
    }

    const currentStructure = sourceDataTree?.stats?.treeStructure

    if (currentStructure) {
        previousStructure.current = currentStructure
    }

    const visibleStructure = currentStructure ?? previousStructure.current

    return (
        <>
            <WirePortal>
                <Wire
                    start={fromPosition}
                    end={toPosition}
                    structure={visibleStructure}
                    selected={isSelected}
                    onDoubleClick={handleDoubleClick}
                />
            </WirePortal>
            <WiresMaskPortal>
                <Wire start={fromPosition} end={toPosition} structure={visibleStructure} drawMask />
            </WiresMaskPortal>
        </>
    )
}

export default React.memo(PortConnectionWire, (prevProps, nextProps) => {
    const a = prevProps.from.nodeInstanceId === nextProps.from.nodeInstanceId
    const b = prevProps.from.portInstanceId === nextProps.from.portInstanceId
    const c = prevProps.to.nodeInstanceId === nextProps.to.nodeInstanceId
    const d = prevProps.to.portInstanceId === nextProps.to.portInstanceId

    return a && b && c && d
})
