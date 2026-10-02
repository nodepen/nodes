import type * as NodePen from '@/types'

export const getProvisionalId = (nodeInstanceId: string): string => {
    return `provisional-${nodeInstanceId}`
}