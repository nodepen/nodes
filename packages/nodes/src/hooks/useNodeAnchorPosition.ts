import { useStore } from '$'

/**
 * Given a node id and one of its anchor ids, return the anchor's current position in world space.
 * @returns `null` if anchor does not exist.
 */
export const useNodeAnchorPosition = (nodeInstanceId: string, anchorId: string): { x: number; y: number } | null => {
    const nodePosition = useStore((state) => state.document.nodes[nodeInstanceId]?.position)
    const anchorDelta = useStore((state) => state.document.nodes[nodeInstanceId]?.anchors?.[anchorId])

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