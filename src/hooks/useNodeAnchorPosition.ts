import { useStore } from '$'
import { usePresenceState } from '@/components/nodes/context/node-state';

export const resolveAnchorPosition = (
    nodePosition: { x: number; y: number } | null,
    anchorDelta: { dx: number; dy: number } | undefined
): { x: number; y: number } | null => {
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

/**
 * Given a node id and one of its anchor ids, return the anchor's current position in world space.
 * @returns `null` if anchor does not exist.
 */
export const useNodeAnchorPosition = (nodeInstanceId: string | null, anchorId: string): { x: number; y: number } | null => {
    const { position: nodePosition } = usePresenceState(nodeInstanceId)

    const anchorDelta = useStore((state) => state.document.nodes[nodeInstanceId ?? '']?.anchors?.[anchorId])

    return resolveAnchorPosition(nodePosition, anchorDelta)
}
