import type * as NodePen from '@/types'

export const getClusterByNodeInstanceId = (
    document: NodePen.Document,
    nodeInstanceId: string
): { clusterId: string; cluster: NodePen.DocumentCluster } | null => {
    for (const [clusterId, cluster] of Object.entries(document.clusters)) {
        if (cluster.nodeInstanceId === nodeInstanceId) {
            return { clusterId, cluster }
        }
    }

    return null
}
