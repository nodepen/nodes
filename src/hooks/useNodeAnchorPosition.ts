import { useStore } from '$'
import { useNodeInternalState, usePresenceState } from '@/components/nodes/context/node-state';

/**
 * Given a node id and one of its anchor ids, return the anchor's current position in world space.
 * @returns `null` if anchor does not exist.
 */
export const useNodeAnchorPosition = (nodeInstanceId: string | null, anchorId: string): { x: number; y: number } | null => {
    const { position: nodePosition } = usePresenceState(nodeInstanceId)

    const anchorDelta = useStore((state) => state.document.nodes[nodeInstanceId ?? '']?.anchors?.[anchorId])

    if (!nodePosition || !anchorDelta) {
        return null
    }

    const { x, y } = nodePosition
    const { dx, dy } = anchorDelta

    return {
        x: x + dx,
        y: y + dy,
    }
}
