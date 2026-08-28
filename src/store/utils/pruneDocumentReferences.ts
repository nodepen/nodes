import type { NodesAppState } from '../state'
import { resetNodePlacement } from './resetNodePlacement'

/** Removes references in various local state to nodes that no longer exist. */
export const pruneDocumentReferences = (state: NodesAppState): void => {
    const { nodes } = state.document

    // Selection
    state.registry.selection.nodes = state.registry.selection.nodes.filter((id) => !!nodes[id])

    // Drag
    if (state.registry.drag.isActive && state.registry.selection.nodes.length === 0) {
        state.registry.drag = {
            isActive: false,
            isCopyActive: false,
            dx: 0,
            dy: 0
        }
    }

    // Hover
    if (state.registry.hover.nodeInstanceId && !nodes[state.registry.hover.nodeInstanceId]) {
        state.registry.hover = {
            nodeInstanceId: null,
            portInstanceId: null,
            branch: null
        }
    }

    // Live wires
    const { live } = state.registry.wires

    for (const key of Object.keys(live.connections)) {
        if (!nodes[live.connections[key].portAnchor.nodeInstanceId]) {
            delete live.connections[key]
        }
    }

    if (live.target && !nodes[live.target.nodeInstanceId]) {
        live.target = null
    }

    // Context menus
    for (const key of Object.keys(state.registry.contextMenus)) {
        const { context } = state.registry.contextMenus[key]

        if ('nodeInstanceId' in context && !nodes[context.nodeInstanceId]) {
            delete state.registry.contextMenus[key]
        }
    }

    // Tooltips
    for (const key of Object.keys(state.registry.tooltips)) {
        const { context } = state.registry.tooltips[key]

        if ('nodeInstanceId' in context && !nodes[context.nodeInstanceId]) {
            delete state.registry.tooltips[key]
        }
    }

    // Model selection source
    if (state.ui.model.mode === 'select' && !nodes[state.ui.model.source.nodeInstanceId]) {
        state.ui.model = {
            mode: 'default',
            selection: {}
        }
    }

    // Node placement
    const { activeNodeId } = state.layout.nodePlacement

    if (activeNodeId && !nodes[activeNodeId]) {
        resetNodePlacement(state)
    }
}
