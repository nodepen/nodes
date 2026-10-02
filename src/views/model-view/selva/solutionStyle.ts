export type SolutionAddress = {
    nodeInstanceId?: string
    portInstanceId?: string
    branchPath?: string
    branchEntryIndex?: string
}

export type SolutionHover = {
    nodeInstanceId: string | null
    portInstanceId: string | null
    branch: { path: string; entryIndex: string } | null
}

export type SolutionViewState = {
    isExpired: boolean
    selectedNodeIds: ReadonlySet<string>
    hiddenNodeIds: ReadonlySet<string>
    hover: SolutionHover
}

export type SolutionStyle = 'default' | 'selected' | 'expired' | 'ghosted' | 'hidden'

export const resolveSolutionStyle = (address: SolutionAddress, state: SolutionViewState): SolutionStyle => {
    const { nodeInstanceId, portInstanceId, branchPath, branchEntryIndex } = address

    if (nodeInstanceId && state.hiddenNodeIds.has(nodeInstanceId)) {
        return 'hidden'
    }

    if (state.isExpired) {
        return 'expired'
    }

    const { hover } = state

    if (hover.branch) {
        const isPortHovered = nodeInstanceId === hover.nodeInstanceId && portInstanceId === hover.portInstanceId

        if (!isPortHovered) {
            return 'ghosted'
        }

        const isEntryHovered = branchPath === hover.branch.path && branchEntryIndex === hover.branch.entryIndex

        return isEntryHovered ? 'selected' : 'default'
    }

    if (nodeInstanceId && state.selectedNodeIds.has(nodeInstanceId)) {
        return 'selected'
    }

    return 'default'
}
