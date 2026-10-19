import type { DataTree } from '@/types'

export const getDataTreeSummary = (tree?: DataTree | null): string => {
    if (!tree || !tree.stats) {
        return ''
    }

    const { branchCount, valueCount, valueTypes, branchValueCountDomain } = tree.stats

    const commonTypeName = valueTypes.length > 0 && valueTypes.every((t) => t === valueTypes[0]) ? valueTypes[0] : 'value'

    const valueCountString = branchValueCountDomain[0] === branchValueCountDomain[1] ? `${branchValueCountDomain[0]}` : `${branchValueCountDomain[0] - branchValueCountDomain[1]}`

    if (valueTypes.includes('file') && valueCount === 1) {
        return tree.branches[0]?.values[0]?.description ?? '1 file'
    }

    if (valueTypes.includes('file')) {
        return `${valueCountString} file${valueCount === 1 ? '' : 's'}`
    }

    if (valueTypes.includes('reference')) {
        return `${valueCountString} referenced item${valueCount === 1 ? '' : 's'}`
    }

    return [
        `${branchCount} list${branchCount === 1 ? '' : 's'}`,
        `of ${valueCountString}`,
        `${commonTypeName}${valueCountString === '1' ? '' : 's'}`,
    ].join(' ')
}
