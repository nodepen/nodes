import type { NodesAppState } from './state'
import { startTransition } from 'react'
import { setAutoFreeze, freeze, current } from 'immer'
import type * as NodePen from '@/types'
import { shallow } from 'zustand/shallow'
import { useStore } from '$'
import { DIMENSIONS } from '@/constants'
import { regionContainsRegion, regionIntersectsRegion } from '@/utils/intersection'
import { getNodeDimensions, getNodeExtents } from '@/utils/node-dimensions'
import { divideDomain, remap } from '@/utils/numerics'
import { expireSolution } from './utils'
import { createInstance } from '@/utils/templates'
import { duplicateInstance } from '@/utils/nodes/duplicateInstance'
import { commitPaste } from './utils/commitPaste'
import { clearClipboard, copySelectionToClipboard } from './utils/clipboard'
import { getProvisionalId } from '@/utils/nodes/getProvisionalId'
import { createList } from '@/utils/data-trees'

const { NODE_MINIMUM_HEIGHT } = DIMENSIONS

type BaseAction = string | ({ type: string } & Record<string, unknown>)
type BaseSetter = (callback: (state: NodesAppState) => void, replace?: boolean, action?: BaseAction) => void
type BaseGetter = () => NodesAppState

// export type NodesAppDispatch = {
//   dispatch: {
//     apply(callback: (state: NodesAppState, get: BaseGetter) => void): void
//     loadDocument(document: NodePen.Document): void
//     loadTemplates(templates: NodePen.NodeTemplate[]): void
//     commitRegionSelection: (selectionMode: 'set' | 'add' | 'remove') => void
//     commitLiveWireEdit: () => void
//     setCameraAspect: (aspect: number) => void
//     setCameraPosition: (x: number, y: number) => void
//     setCameraZoom: (zoom: number) => void
//     setNodePosition: (id: string, x: number, y: number) => void
//     clearInterface: () => void
//     clearSelection: () => void
//   }
// }

export type NodesAppDispatch = ReturnType<typeof createDispatch>

setAutoFreeze(false)

export const createDispatch = (set: BaseSetter, get: BaseGetter) => {
    const dispatch = {
        apply: (callback: (state: NodesAppState, get: BaseGetter) => void) => set((state) => callback(state, get)),
        loadDocument: (document: NodePen.Document) =>
            set((state) => {
                state.document = document

                // for (const node of Object.values(document.nodes)) {
                //   // Sanitize node properties
                //   const { instanceId, templateId } = node

                //   const template = state.templates[templateId]

                //   if (!template) {
                //     console.log(`🐍 Could not find template [${templateId}] for document node [${instanceId}]`)
                //     continue
                //   }

                //   state.document.nodes[instanceId] = createInstance(template)

                //   // const nodeWidth = getNodeWidth()
                //   // const nodeHeight = getNodeHeight(template)

                //   // node.dimensions = {
                //   //   width: nodeWidth,
                //   //   height: nodeHeight,
                //   // }

                //   // const inputInstanceIds = Object.keys(inputs)
                //   // const inputHeightSegments = divideDomain(
                //   //   [0, nodeHeight - NODE_INTERNAL_PADDING * 2],
                //   //   inputInstanceIds.length > 0 ? inputInstanceIds.length : 1
                //   // )

                //   // for (let i = 0; i < inputInstanceIds.length; i++) {
                //   //   const currentId = inputInstanceIds[i]
                //   //   const currentDomain = inputHeightSegments[i]

                //   //   const deltaX = 0
                //   //   const deltaY = remap(0.5, [0, 1], currentDomain) + NODE_INTERNAL_PADDING

                //   //   node.anchors[currentId] = {
                //   //     dx: deltaX,
                //   //     dy: deltaY,
                //   //   }
                //   // }

                //   // const outputInstanceIds = Object.keys(outputs)
                //   // const outputHeightSegments = divideDomain(
                //   //   [0, nodeHeight - NODE_INTERNAL_PADDING * 2],
                //   //   outputInstanceIds.length > 0 ? outputInstanceIds.length : 1
                //   // )

                //   // for (let i = 0; i < outputInstanceIds.length; i++) {
                //   //   const currentId = outputInstanceIds[i]
                //   //   const currentDomain = outputHeightSegments[i]

                //   //   const deltaX = nodeWidth
                //   //   const deltaY = remap(0.5, [0, 1], currentDomain) + NODE_INTERNAL_PADDING

                //   //   node.anchors[currentId] = {
                //   //     dx: deltaX,
                //   //     dy: deltaY,
                //   //   }
                //   // }
                // }

                // expireSolution(state)
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
                    startTransition(() => {
                        state.camera.position = { x, y }
                    })
                },
                false,
                'camera/setPosition'
            ),
        setCameraZoom: (zoom: number) =>
            set(
                (state) => {
                    startTransition(() => {
                        state.camera.zoom = zoom
                    })
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
                        copySelectionToClipboard(state)

                        const { dx, dy } = state.registry.drag

                        state.clipboard.nodes = state.clipboard.nodes.map((node) => ({
                            ...node,
                            position: {
                                x: node.position.x - dx,
                                y: node.position.y - dy
                            }
                        }))

                        for (const instanceId of state.registry.selection.nodes) {
                            const currentInstance = current(state.document.nodes[instanceId])

                            state.document.nodes[getProvisionalId(instanceId)] = {
                                ...currentInstance,
                                instanceId: getProvisionalId(instanceId),
                                // position: {
                                //     x: currentInstance.position.x + dx,
                                //     y: currentInstance.position.y + dy
                                // },
                                status: {
                                    ...currentInstance.status,
                                    isProvisional: true
                                }
                            }
                        }
                    } else {
                        for (const instanceId of state.registry.selection.nodes) {
                            delete state.document.nodes[getProvisionalId(instanceId)]
                        }
                        clearClipboard(state)
                    }

                    const direction = isCopyActive ? -1 : 1

                    const dx = state.registry.drag.dx * direction
                    const dy = state.registry.drag.dy * direction

                    // Apply or reset drag to selected nodes
                    for (const nodeInstanceId of state.registry.selection.nodes) {
                        const selectedNode = state.document.nodes[nodeInstanceId]

                        if (!selectedNode) {
                            console.log('🐍 Could not update position of node because node not found!')
                            continue
                        }

                        state.document.nodes[nodeInstanceId].position = {
                            x: selectedNode.position.x + dx,
                            y: selectedNode.position.y + dy,
                        }
                    }
                },
                false,
                'clipboard/drag'
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
                            delete state.document.nodes[getProvisionalId(instanceId)]
                        }
                        clearClipboard(state)
                        expireSolution(state)
                    }

                    state.registry.drag = {
                        isActive: false,
                        isCopyActive: false,
                        dx: 0,
                        dy: 0
                    }
                },
                false,
                'node/endDrag'
            ),
        setNodePosition: (id: string, x: number, y: number) =>
            set(
                (state) => {
                    const node = state.document.nodes[id]

                    if (!node) {
                        return
                    }

                    if (!state.registry.selection.nodes.includes(id)) {
                        startTransition(() => {
                            node.position.x = x
                            node.position.y = y
                        })

                        return
                    }

                    const { x: currentX, y: currentY } = node.position

                    const [dx, dy] = [x - currentX, y - currentY]

                    for (const nodeInstanceId of state.registry.selection.nodes) {
                        const selectedNode = state.document.nodes[nodeInstanceId]

                        if (!selectedNode) {
                            console.log('🐍 Could not move selected node position because node is not present in document!')
                            continue
                        }

                        state.document.nodes[nodeInstanceId].position = {
                            x: selectedNode.position.x + dx,
                            y: selectedNode.position.y + dy,
                        }
                    }
                },
                false,
                {
                    type: 'node/setPosition',
                    payload: { id, x, y },
                }
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
                        isComponentLibraryOpen: false,
                        isParameterLibraryOpen: false
                    }

                    // TODO: This is sloppy. It should not be possible for provisional nodes to get left on the canvas.
                    for (const nodeId of Object.keys(state.document.nodes)) {
                        if (state.document.nodes[nodeId].status.isProvisional) {
                            delete state.document.nodes[nodeId]
                        }
                    }
                },
                false,
                'ui/clearInterface'
            ),
        clearSelection: () =>
            set(
                (state) => {
                    state.registry.selection.nodes = []
                    state.registry.hover.branch = null
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
        commitModelSelection: () =>
            set(
                (state) => {
                    const modelState = state.ui.model
                    switch (modelState.mode) {
                        case 'select': {
                            const { selection, source } = current(modelState)

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

                            state.document.nodes[source.nodeInstanceId].values[source.portInstanceId] = createList(values)

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
            )
    }

    return { dispatch }
}

export const useDispatch = () => {
    return useStore((state) => state.dispatch, shallow)
}
