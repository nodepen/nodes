import type * as NodePen from '@/types'

export const getClusterByNodeInstanceId = (
    document: NodePen.Document,
    nodeInstanceId: string
): NodePen.DocumentCluster | null => {
    for (const cluster of Object.values(document.clusters)) {
        if (cluster.nodeInstanceId === nodeInstanceId) {
            return cluster
        }
    }

    return null
}
