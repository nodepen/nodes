import type * as NodePen from '@nodepen/core'

export const isDataTreePath = (path: string): path is NodePen.DataTreePath => {
    const isValidStartCharacter = path[0] === '{'
    const isValidEndCharacter = path[path.length - 1] === '}'

    if (!isValidStartCharacter || !isValidEndCharacter) {
        return false
    }

    const pathData = path.substring(1, path.length - 1)
    const pathFragments = pathData.split(';')

    return pathFragments.every((fragment) => /^\d+$/.test(fragment))
}