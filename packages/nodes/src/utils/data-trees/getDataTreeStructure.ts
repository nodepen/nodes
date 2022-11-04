import type * as NodePen from '@nodepen/core'
import { getDataTreePaths } from './getDataTreePaths'

export const getDataTreeStructure = (data: NodePen.DataTree): NodePen.DataTreeStructure => {
    const paths = getDataTreePaths(data)

    if (paths.length === 0) {
        return 'empty'
    }

    if (paths.length === 1) {
        const values = data[paths[0]]

        if (values.length === 1) {
            return 'single'
        } else {
            return 'list'
        }
    }

    return 'tree'
}