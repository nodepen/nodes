import type * as NodePen from '@/types'

export const createList = (values: NodePen.DataTreeValue[]): NodePen.DataTree => {
    const valueTypes = new Set<NodePen.DataTreeValueType>()

    for (const value of values) {
        valueTypes.add(value.type)
    }

    return {
        branches: [
            {
                order: 0,
                path: '{0}',
                values: structuredClone(values)
            }
        ],
        stats: {
            branchCount: 1,
            branchValueCountDomain: [values.length, values.length],
            treeStructure: 'list',
            valueTypes: [...valueTypes],
            valueCount: values.length
        }
    }
}