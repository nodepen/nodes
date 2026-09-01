import type { NodesAppState } from './state'
import { freeze, current } from 'immer'
import type * as NodePen from '@/types'
import { shallow } from 'zustand/shallow'
import { useStore } from '$'
import { DIMENSIONS } from '@/constants'
import { regionContainsRegion, regionIntersectsRegion } from '@/utils/intersection'
import { getNodeDimensions, getNodeExtents } from '@/utils/node-dimensions'
import { getNodeTypeForTemplate } from '@/utils/templates/getNodeTypeForTemplate'
import { expireSolution, resetNodePlacement, pruneDocumentReferences, getNodesIncludedInDrag, addDocumentNode, removeDocumentNode, setDocumentNodes } from './utils'
import { commitPaste } from './utils/commitPaste'
import { clearClipboard, copySelectionToClipboard } from './utils/clipboard'
import { getProvisionalId } from '@/utils/nodes/getProvisionalId'
import { createList } from '@/utils/data-trees'
import { tryGetControl } from '@/utils/controls'
import { getValidGeometryForType } from '@/utils/geometry-types'
import { saveDocument } from './utils/saveDocument'

const { NODE_MINIMUM_HEIGHT } = DIMENSIONS

type BaseAction = string | ({ type: string } & Record<string, unknown>)
type BaseSetter = (callback: (state: NodesAppState) => void, replace?: boolean, action?: BaseAction) => void
type BaseGetter = () => NodesAppState

export type NodesAppDispatch = ReturnType<typeof createDispatch>

export const createDispatch = (set: BaseSetter, get: BaseGetter) => {
    const dispatch = {
        apply: (callback: (state: NodesAppState, get: BaseGetter) => void) => set((state) => callback(state, get)),
        loadDocument: (document: NodePen.Document) =>
            set((state) => {
                // Preserve local provisional nodes
                const provisionalNodes = Object.values(state.document.nodes).filter(
                    (node) => node.status.isProvisional
                )

                const nextNodes = { ...document.nodes }

                for (const node of provisionalNodes) {
                    nextNodes[node.instanceId] = current(node)
                }

                // Apply to internal state
                state.document = { ...document, nodes: {} }
                setDocumentNodes(state, nextNodes)

                pruneDocumentReferences(state)
            }),
        loadTemplates: (templates: NodePen.NodeTemplate[]) =>
            set(
                (state) => {
                    const library: Record<string, NodePen.NodeTemplate> = {}

                    for (const template of templates) {
                        library[template.guid] = template
                    }

                    state.templates = freeze(library)
                },
                false,
                'templates/loadTemplates'
            ),
        loadPreferences: (preferences: NodePen.DocumentPreferences) =>
            set(
                (state) => {
                    const currentPreferences = state.ui.preferences

                    if (
                        currentPreferences.componentLabels === preferences.componentLabels &&
                        currentPreferences.parameterLabels === preferences.parameterLabels
                    ) {
                        return
                    }

                    state.ui.preferences = preferences

                    for (const node of Object.values(state.document.nodes)) {
                        const template = state.templates[node.templateId]

                        if (!template || getNodeTypeForTemplate(template) !== 'generic-node') {
                            continue
                        }

                        const { anchors, dimensions } = getNodeDimensions(node, template, preferences)

                        node.anchors = { ...node.anchors, ...anchors }
                        node.dimensions = { ...node.dimensions, ...dimensions }
                    }
                },
                false,
                'preferences/load'
            ),
        loadSolutionData: (data: NodePen.DocumentSolutionData | null) =>
            set(
                (state) => {
                    if (!data && !state.solution?.data) {
                        return
                    }

                    if (!data && state.solution.data) {
                        // Client has cleared solution data
                        // Assume we're waiting for a new one, eventually...
                        // And refuse to let go of the past
                        state.solution.flags = {
                            isExpired: true,
                            isModelExpired: true,
                            isFailed: false,
                        }
                        state.solution.messages = {
                            document: {
                                status: 'pending',
                                message: 'Solving document...'
                            },
                            model: {
                                status: 'idle',
                                message: 'Waiting for solution...'
                            }
                        }
                        return
                    }

                    if (!data) {
                        // Appease typescript
                        return
                    }

                    // New solution delivered, set values and kick off loading
                    const isNewSolution = state.solution.id !== data.solutionId

                    state.solution.data = freeze(data)

                    if (!isNewSolution) {
                        return
                    }

                    state.solution.id = data.solutionId
                    state.solution.flags = {
                        isExpired: false,
                        isModelExpired: true,
                        isFailed: false
                    }

                    if (data.documentRuntimeData.exceptionMessages?.length) {
                        // Solution failed catastrophically
                        state.solution.messages = {
                            document: {
                                status: 'error',
                                message: 'Failed to solve document!'
                            },
                            model: {
                                status: 'error',
                                message: 'Failed to create model!'
                            }
                        }
                        state.solution.flags.isFailed = true

                        for (const message of data.documentRuntimeData.exceptionMessages) {
                            console.error(message)
                        }
                    } else {
                        // Solution succeeded glamorously
                        state.solution.messages = {
                            document: {
                                status: 'ok',
                                message: `Solved ${Object.keys(state.document.nodes).length} nodes.`
                            },
                            model: {
                                status: 'pending',
                                message: 'Loading model...'
                            }
                        }
                    }
                },
                false,
                'solution/loadSolution'
            ),
        commitRegionSelection: (selectionMode: 'set' | 'add' | 'remove') =>
            set(
                (state) => {
                    if (!state.registry.selection.region.isActive) {
                        console.log('🐍 Attempted to commit a region selection that was not active!')
                        return
                    }

                    const selectionRegion = state.registry.selection.region
                    const { from, to } = selectionRegion

                    const regionMode = from.x < to.x ? 'contains' : 'intersects'

                    const selectedNodeIds: string[] = []

                    for (const node of Object.values(state.document.nodes)) {
                        const nodeExtents = getNodeExtents(node)

                        let isSelected = false

                        switch (regionMode) {
                            case 'contains': {
                                if (regionContainsRegion(selectionRegion, nodeExtents)) {
                                    isSelected = true
                                }
                                break
                            }
                            case 'intersects': {
                                if (regionIntersectsRegion(selectionRegion, nodeExtents)) {
                                    isSelected = true
                                }
                                break
                            }
                        }

                        if (!isSelected) {
                            continue
                        }

                        selectedNodeIds.push(node.instanceId)
                    }

                    // Update top-level selection
                    switch (selectionMode) {
                        case 'set': {
                            state.registry.selection.nodes = selectedNodeIds
                            break
                        }
                        case 'add': {
                            for (const id of selectedNodeIds) {
                                if (!state.registry.selection.nodes.includes(id)) {
                                    state.registry.selection.nodes.push(id)
                                }
                            }
                            break
                        }
                        case 'remove': {
                            state.registry.selection.nodes = state.registry.selection.nodes.filter(
                                (id) => !selectedNodeIds.includes(id)
                            )
                            break
                        }
                    }

                    // Reset state to unset value
                    state.registry.selection.region = { isActive: false }

                    state.callbacks.onSelectionRegionUpdated?.(current(state))
                    state.callbacks.onSelectionUpdated?.(current(state))
                },
                false,
                'selection/region/commit'
            ),
        commitLiveWireEdit: () =>
            set(
                (state) => {
                    const unsetLiveWireState = {
                        cursor: null,
                        target: null,
                        connections: {},
                        mode: null,
                    }

                    const { connections, target, mode } = state.registry.wires.live

                    if (!target) {
                        // No potential connection made, reset state to unset state
                        state.registry.wires.live = unsetLiveWireState

                        state.callbacks.onWiresUpdated?.(current(state))

                        return
                    }

                    if (!mode) {
                        console.log('🐍 Tried to commit a live wire edit but no mode was specified!')
                    }

                    for (const connection of Object.values(connections)) {
                        const { portAnchor, portAnchorType } = connection

                        const [inputPort, outputPort] = portAnchorType === 'input' ? [portAnchor, target] : [target, portAnchor]

                        const currentSources = state.document.nodes[inputPort.nodeInstanceId]?.sources?.[inputPort.portInstanceId]

                        if (!currentSources) {
                            console.log('🐍 Tried to update node port sources that did not exist!')
                            continue
                        }

                        switch (mode) {
                            case 'set': {
                                // Set the given output port as the only source on the given input port
                                state.document.nodes[inputPort.nodeInstanceId].sources[inputPort.portInstanceId] = [outputPort]
                                break
                            }
                            case 'merge': {
                                // Add the given output port to any sources at the given input port
                                if (
                                    currentSources.some(
                                        (source) =>
                                            source.nodeInstanceId === outputPort.nodeInstanceId &&
                                            source.portInstanceId === outputPort.portInstanceId
                                    )
                                ) {
                                    // Source already exists
                                    break
                                }

                                state.document.nodes[inputPort.nodeInstanceId].sources[inputPort.portInstanceId].push(outputPort)
                                break
                            }
                            case 'remove': {
                                // Remove the given output port from the sources at the given input port
                                state.document.nodes[inputPort.nodeInstanceId].sources[inputPort.portInstanceId] =
                                    currentSources.filter(
                                        (source) =>
                                            source.nodeInstanceId !== outputPort.nodeInstanceId &&
                                            source.portInstanceId !== outputPort.portInstanceId
                                    )
                                break
                            }
                            case 'move': {
                                // TODO
                                break
                            }
                        }

                        state.registry.wires.live = unsetLiveWireState
                        state.callbacks.onWiresUpdated?.(current(state))
                    }

                    // Connections changed, expire solution
                    expireSolution(state)

                    // All connections processed, reset state to unset state
                    state.registry.wires.live = unsetLiveWireState
                },
                false,
                'wires/edit/commit'
            ),
        setCameraAspect: (aspect: number) =>
            set(
                (state) => {
                    state.camera.aspect = aspect
                },
                false,
                'camera/setAspect'
            ),
        setCameraPosition: (x: number, y: number) =>
            set(
                (state) => {
                    state.camera.position = { x, y }
                    state.callbacks?.onCameraMove?.(current(state))
                },
                false,
                'camera/setPosition'
            ),
        setCameraZoom: (zoom: number) =>
            set(
                (state) => {
                    state.camera.zoom = zoom
                },
                false,
                'camera/setZoom'
            ),
        copySelectionToClipboard: () =>
            set(
                (state) => {
                    copySelectionToClipboard(state)
                },
                false,
                'clipboard/copy'
            ),
        pasteFromClipboard: () =>
            set(
                (state) => {
                    const dy = (NODE_MINIMUM_HEIGHT + 36) * (state.clipboard.pasteCount + 1)

                    commitPaste(state, { dx: 0, dy })

                    expireSolution(state)
                },
                false,
                'clipboard/paste'
            ),
        toggleDragCopy: (isCopyActive: boolean) =>
            set(
                (state) => {
                    state.registry.drag.isCopyActive = isCopyActive

                    if (isCopyActive) {
                        // Create provisional drag copies
                        copySelectionToClipboard(state)

                        const { dx, dy } = state.registry.drag

                        state.clipboard.nodes = state.clipboard.nodes.map((node) => ({
                            ...node,
                            position: {
                                x: node.position.x,
                                y: node.position.y
                            }
                        }))

                        for (const instanceId of state.registry.selection.nodes) {
                            const node = state.document.nodes[instanceId]

                            if (!node) {
                                continue
                            }

                            const currentInstance = current(node)

                            addDocumentNode(state, {
                                ...currentInstance,
                                instanceId: getProvisionalId(instanceId),
                                position: {
                                    x: currentInstance.position.x + dx,
                                    y: currentInstance.position.y + dy
                                },
                                status: {
                                    ...currentInstance.status,
                                    isProvisional: true
                                }
                            })
                        }
                    } else {
                        // Clear provisional drag copies
                        for (const instanceId of state.registry.selection.nodes) {
                            removeDocumentNode(state, getProvisionalId(instanceId))
                        }
                        clearClipboard(state)
                    }
                },
                false,
                'clipboard/drag'
            ),
        beginDrag: () =>
            set(
                (state) => {
                    state.registry.drag.isActive = true

                    // Selection is ready before drag, and does not change during drag
                    const included: Record<string, true> = {}
                    for (const nodeInstanceId of getNodesIncludedInDrag(state)) {
                        included[nodeInstanceId] = true
                    }
                    state.registry.drag.includedNodeIds = included
                },
                false,
                'node/beginDrag'
            ),
        endDrag: () =>
            set(
                (state) => {
                    if (state.registry.drag.isCopyActive) {
                        // Create copies and place at new position
                        commitPaste(state, {
                            dx: state.registry.drag.dx,
                            dy: state.registry.drag.dy
                        })
                        for (const instanceId of state.clipboard.nodes.map((node) => node.instanceId)) {
                            removeDocumentNode(state, getProvisionalId(instanceId))
                        }
                        clearClipboard(state)
                        expireSolution(state)
                    } else {
                        // Apply drag as final position of nodes
                        const { dx, dy } = state.registry.drag

                        for (const nodeInstanceId of getNodesIncludedInDrag(state)) {
                            const node = state.document.nodes[nodeInstanceId]

                            if (!node) {
                                continue
                            }

                            node.position = {
                                x: node.position.x + dx,
                                y: node.position.y + dy
                            }
                        }
                    }

                    state.registry.drag = {
                        isActive: false,
                        isCopyActive: false,
                        dx: 0,
                        dy: 0,
                        includedNodeIds: {}
                    }

                    state.callbacks.onDragEnd?.(current(state))
                },
                false,
                'node/endDrag'
            ),
        toggleFlag: (nodeInstanceId: string, portInstanceId: string, flag: NodePen.PortFlag) => set((state) => {
            const currentFlags = state.document.nodes[nodeInstanceId]?.portConfigurations[portInstanceId]?.flags

            if (!currentFlags) {
                return
            }

            const nextFlags: NodePen.PortFlag[] = []

            switch (flag) {
                case 'simplify': {
                    if (currentFlags.includes('simplify')) {
                        nextFlags.push(...currentFlags.filter((flag) => flag !== 'simplify'))
                    } else {
                        nextFlags.push(...currentFlags)
                        nextFlags.push('simplify')
                    }
                    break
                }
                case 'flatten': {
                    if (currentFlags.includes('flatten')) {
                        nextFlags.push(...currentFlags.filter((flag) => flag !== 'flatten'))
                    } else {
                        nextFlags.push(...currentFlags.filter((flag) => flag !== 'graft'))
                        nextFlags.push('flatten')
                    }
                    break
                }
                case 'graft': {
                    if (currentFlags.includes('graft')) {
                        nextFlags.push(...currentFlags.filter((flag) => flag !== 'graft'))
                    } else {
                        nextFlags.push(...currentFlags.filter((flag) => flag !== 'flatten'))
                        nextFlags.push('graft')
                    }
                }
            }

            state.document.nodes[nodeInstanceId].portConfigurations[portInstanceId].flags = nextFlags

            // Recompute node dimensions based on flag placement
            const node = state.document.nodes[nodeInstanceId]
            const template = state.templates[node.templateId]

            if (!template) {
                console.log('🐍 Could not find template for node when recomputing dimensions!')
                expireSolution(state)
                return
            }

            const { anchors, dimensions } = getNodeDimensions(node, template)

            node.anchors = {
                ...node.anchors,
                ...anchors
            }
            node.dimensions = {
                ...node.dimensions,
                ...dimensions
            }

            // Solution required
            expireSolution(state)
        },
            false,
            'port/toggleFlag'
        ),
        clearInterface: () =>
            set(
                (state) => {
                    state.registry.contextMenus = {}
                    state.registry.documentControls = {
                        activeDrawer: null
                    }
                    state.registry.tooltips = {}

                    state.ui.sidebar = {
                        ...state.ui.sidebar,
                        isComponentLibraryOpen: false,
                        isParameterLibraryOpen: false
                    }

                    // Drop provisional nodes
                    for (const nodeId of [...state.registry.documentNodeIds]) {
                        if (state.document.nodes[nodeId]?.status.isProvisional) {
                            removeDocumentNode(state, nodeId)
                        }
                    }

                    resetNodePlacement(state)
                },
                false,
                'ui/clearInterface'
            ),
        clearSelection: () =>
            set(
                (state) => {
                    state.registry.selection.nodes = []
                    state.registry.selection.groups = []
                    state.registry.hover.branch = null

                    state.callbacks.onSelectionUpdated?.(current(state))
                },
                false,
                'ui/clearSelection'
            ),
        clearModelState: () =>
            set(
                (state) => {
                    const nextSelection = current(state.ui.model.selection)

                    for (const key of Object.keys(nextSelection)) {
                        nextSelection[key] = []
                    }

                    state.ui.model = {
                        mode: 'default',
                        selection: nextSelection
                    }
                },
                false,
                'ui/clearModelState'
            ),
        undo: () =>
            set(
                (state) => {
                    state.callbacks.onUndo?.(current(state))
                },
                false,
                'history/undo'
            ),
        redo: () =>
            set(
                (state) => {
                    state.callbacks.onRedo?.(current(state))
                },
                false,
                'history/redo'
            ),
        startModelSelection: (nodeInstanceId: string, portInstanceId: string, valueType: string) => {
            const validGeometryTypes = getValidGeometryForType(valueType)

            set(
                (state) => {
                    state.ui.model = {
                        mode: 'select',
                        selection: {},
                        selectionFilter: validGeometryTypes,
                        source: {
                            nodeInstanceId,
                            portInstanceId
                        }
                    }
                },
                false,
                'ui/startModelSelection'
            )

            dispatch.clearInterface()
        },
        commitModelSelection: () =>
            set(
                (state) => {
                    const modelState = state.ui.model
                    switch (modelState.mode) {
                        case 'select': {
                            const { selection, source } = current(modelState)

                            const sourceNode = state.document.nodes[source.nodeInstanceId]

                            if (!sourceNode) {
                                state.ui.model = {
                                    mode: 'default',
                                    selection: {}
                                }
                                break
                            }

                            const values: NodePen.DataTreeValue[] = []

                            for (const [sourceKey, guids] of Object.entries(selection)) {
                                for (const guid of guids) {
                                    values.push({
                                        type: 'reference',
                                        description: 'Referenced geometry',
                                        order: values.length,
                                        sourceFileKey: sourceKey,
                                        sourceFileGuid: guid
                                    })
                                }
                            }

                            sourceNode.values[source.portInstanceId] = createList(values)

                            state.ui.model = {
                                mode: 'default',
                                selection: {}
                            }

                            expireSolution(state)
                            break
                        }
                        case 'default':
                        default: {
                            break
                        }
                    }
                },
                false,
                'port/commitModelSelection'
            ),
        addControl: (controlType: 'input' | 'output', nodeInstanceId: string, portInstanceId: string) =>
            set(
                (state) => {
                    if (tryGetControl(state.document.controls, controlType, nodeInstanceId, portInstanceId)) {
                        // Already controlled, nothing to do.
                        return
                    }

                    const list = state.document.controls[controlType]

                    const nextOrder = list.length ? Math.max(...list.map((control) => control.order)) + 1 : 0

                    list.push({
                        order: nextOrder,
                        ref: {
                            nodeInstanceId,
                            portInstanceId
                        }
                    })

                    state.ui.sidebar.isDocumentControlsOpen = true

                    saveDocument(state)
                },
                false,
                'controls/addControl'
            ),
        removeControl: (controlType: 'input' | 'output', nodeInstanceId: string, portInstanceId: string) =>
            set(
                (state) => {
                    const list = state.document.controls[controlType]

                    const control = tryGetControl(state.document.controls, controlType, nodeInstanceId, portInstanceId)

                    if (!control) {
                        return
                    }

                    list.splice(list.indexOf(control), 1)

                    // Re-pack remaining orders so they stay contiguous from 0.
                    const sorted = [...list].sort((a, b) => a.order - b.order)
                    sorted.forEach((control, i) => {
                        control.order = i
                    })

                    state.ui.sidebar.isDocumentControlsOpen = true

                    saveDocument(state)
                },
                false,
                'controls/removeControl'
            ),
        moveControl: (controlType: 'input' | 'output', nodeInstanceId: string, portInstanceId: string, delta: number) =>
            set(
                (state) => {
                    const list = state.document.controls[controlType]

                    const control = tryGetControl(state.document.controls, controlType, nodeInstanceId, portInstanceId)

                    if (!control) {
                        return
                    }

                    const sorted = [...list].sort((a, b) => a.order - b.order)
                    const currentIndex = sorted.indexOf(control)
                    const targetIndex = currentIndex + delta

                    if (targetIndex < 0 || targetIndex >= sorted.length) {
                        // Nothing to swap with, leave order as-is.
                        return
                    }

                    const targetControl = sorted[targetIndex]

                    const currentOrder = control.order
                    control.order = targetControl.order
                    targetControl.order = currentOrder

                    saveDocument(state)
                },
                false,
                'controls/moveControl'
            )
    }

    return { dispatch }
}

export const useDispatch = () => {
    return useStore((state) => state.dispatch, shallow)
}
