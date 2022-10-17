import type * as NodePen from '@nodepen/core'
import { getDataTreeStructure } from './getDataTreeStructure'

/**
 * Given a data tree, return a single value if there is only one value. Otherwise, return `undefined`
 */
export const tryGetSingleValue = (data: NodePen.DataTree): NodePen.DataTreeValue | undefined => {
    if (getDataTreeStructure(data) !== 'single') {
        return undefined
    }

    return Object.values(data)[0][0]
}