import type * as NodePen from '@nodepen/core'
import { isDataTreePath } from './isDataTreePath'

export const getDataTreePaths = (data: NodePen.DataTree): NodePen.DataTreePath[] => {
    const pathKeys = Object.keys(data)
    const validPathKeys = pathKeys.filter(isDataTreePath)

    if (pathKeys.length !== validPathKeys.length) {
        console.log('🐍 Malformed data tree detected. Path keys are not correct.')
    }

    return validPathKeys
}