import type * as NodePen from '@/types'

export const createEmptyTree = (): NodePen.DataTree => {
    return {
        branches: [],
        stats: {
            branchCount: 0,
            branchValueCountDomain: [0, 0],
            treeStructure: 'empty',
            valueTypes: [],
            valueCount: 0
        }
    }
}