import { useStore } from '$'
import { useNodeInternalState } from '@/components/nodes/context/node-state'
import { resolveAnchorPosition } from './useNodeAnchorPosition'

/**
 * Same result as `useNodeAnchorPosition`, but for a port that's a descendant of its
 * own node's `NodeInternalStateProvider`
 */
export const useNodeContextAnchorPosition = (nodeInstanceId: string, anchorId: string): { x: number; y: number } | null => {
    const { position: nodePosition } = useNodeInternalState()

    const anchorDelta = useStore((state) => state.document.nodes[nodeInstanceId]?.anchors?.[anchorId])

    return resolveAnchorPosition(nodePosition, anchorDelta)
}
