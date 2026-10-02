import { useStore } from '$'
import type * as NodePen from '@/types'
import { CLUSTER_TEMPLATE } from '../clusters/clusterTemplate'

export const tryGetTemplate = (templateId: string): NodePen.NodeTemplate | undefined => {
    if (templateId === 'cluster') {
        return {
            ...CLUSTER_TEMPLATE,
            inputs: [],
            outputs: []
        }
    }

    return useStore.getState().templates[templateId]
}
