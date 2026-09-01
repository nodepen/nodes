import { useDocumentRef, useImperativeEvent } from '@/hooks'
import { useDispatch } from '@/store'
import { expireSolution, removeDocumentNode } from '@/store/utils'
import { useCallback, useRef } from 'react'
import { useStore } from '$'
import { current } from 'immer'
import { getNodeTypeForTemplate } from '@/utils/templates/getNodeTypeForTemplate'
import { saveDocument } from '@/store/utils/saveDocument'
import { isCtrl } from '@/utils/dom/isCtrl'
import { useIsEditable } from '@/hooks/useIsEditable'
import { newGuid } from '@/utils/common'
import { COLORS } from '@/constants'

export const useGlobalHotkeys = () => {
    const {
        apply,
        clearInterface,
        clearSelection,
        clearModelState,
        toggleDragCopy,
        pasteFromClipboard,
        commitModelSelection,
        undo,
        redo
    } = useDispatch()

    const isEditable = useIsEditable()

    const handleKeyDown = useCallback((e: KeyboardEvent): void => {
        // Actions available in all cases (i.e. debug)
        switch (e.key) {
            case ' ': {
                console.log({
                    document: useStore.getState().document,
                    solution: useStore.getState().solution,
                    presence: useStore.getState().presence
                })

                break
            }
            case 'Enter': {
                commitModelSelection()
                break
            }
            case 'Esc':
            case 'Escape': {
                clearInterface()
                clearSelection()
                clearModelState()
                break
            }
            case 'a':
            case 'A': {
                if (!isCtrl(e)) {
                    return
                }

                apply((state) => {
                    const selection: string[] = []
                    for (const node of Object.values(state.document.nodes)) {
                        const template = state.templates[node.templateId]

                        if (getNodeTypeForTemplate(template) === 'unknown') {
                            console.log(`🐍 Could not select unknown node`)
                            continue
                        }

                        selection.push(node.instanceId)
                    }
                    state.registry.selection.nodes = selection
                })

                break
            }
        }

        if (!isEditable) {
            return
        }

        // Actions that require edit to be enabled
        switch (e.key) {
            case 'Control':
            case 'Meta':
                break
            case 'Delete':
            case 'Backspace': {
                apply((state) => {
                    if (Object.keys(state.registry.contextMenus ?? {}).length > 0) {
                        return
                    }

                    if (state.registry.selection.nodes.length === 0 && state.registry.selection.groups.length === 0) {
                        return
                    }

                    const deletedIds = new Set(state.registry.selection.nodes)

                    // Delete selected nodes
                    for (const id of state.registry.selection.nodes) {
                        state.document.controls.input = state.document.controls.input.filter((control) => control.ref.nodeInstanceId !== id)
                        state.document.controls.output = state.document.controls.output.filter((control) => control.ref.nodeInstanceId !== id)
                        removeDocumentNode(state, id)
                    }

                    // Remove deleted nodes from sources throughout the document
                    for (const node of Object.values(state.document.nodes)) {
                        for (const inputInstanceId of Object.keys(node.sources)) {
                            const filtered = node.sources[inputInstanceId].filter((source) => !deletedIds.has(source.nodeInstanceId))
                            if (filtered.length !== node.sources[inputInstanceId].length) {
                                node.sources[inputInstanceId] = filtered
                            }
                        }
                    }

                    // Delete selected groups
                    for (const id of state.registry.selection.groups) {
                        delete state.document.groups[id]
                    }

                    // Remove deleted nodes from groups
                    for (const [groupId, group] of Object.entries(state.document.groups ?? {})) {
                        const currentNodes = group.items?.nodes ?? []
                        const nextNodes = currentNodes.filter((nodeInstanceId) => !deletedIds.has(nodeInstanceId))

                        if (nextNodes.length === currentNodes.length) {
                            continue
                        }

                        if (nextNodes.length === 0) {
                            // Nothing left to draw a box around, and nothing left to select.
                            delete state.document.groups[groupId]
                            continue
                        }

                        group.items.nodes = nextNodes
                    }

                    expireSolution(state)
                })

                break
            }
            case 'c':
            case 'C': {
                if (!isCtrl(e)) {
                    return
                }

                apply((state) => {
                    state.clipboard.pasteCount = 0
                    state.clipboard.nodes = state.registry.selection.nodes
                        .filter((id) => !!state.document.nodes[id])
                        .map((id) => current(state.document.nodes[id]))
                })

                break
            }
            case 'g':
            case 'G': {
                if (!isCtrl(e)) {
                    return
                }

                e.preventDefault()

                if (e.shiftKey) {
                    // Remove selected nodes from all group memberships
                    apply((state) => {
                        const currentSelection = state.registry.selection.nodes

                        if (currentSelection.length === 0) {
                            return
                        }

                        for (const group of Object.values(state.document.groups)) {
                            group.items.nodes = group.items.nodes.filter((nodeId) => !currentSelection.includes(nodeId))
                        }

                        saveDocument(state)
                    })

                    return
                }

                // Create group from current selection
                apply((state) => {
                    const currentSelection = state.registry.selection.nodes

                    if (currentSelection.length === 0) {
                        return
                    }

                    state.document.groups[newGuid()] = {
                        color: COLORS.DARK,
                        items: {
                            nodes: currentSelection
                        }
                    }

                    saveDocument(state)
                })

                break
            }
            case 'q':
            case 'Q': {
                if (!isCtrl(e)) {
                    return
                }

                apply((state) => {
                    const eligibleNodeTypes: ReturnType<typeof getNodeTypeForTemplate>[] = ['generic-node', 'generic-parameter']
                    const eligibleNodes = state.registry.selection.nodes
                        .map((nodeInstanceId) => state.document.nodes[nodeInstanceId])
                        .filter((node) => !!node && eligibleNodeTypes.includes(getNodeTypeForTemplate(state.templates[node.templateId])))

                    if (eligibleNodes.length === 0) {
                        return
                    }

                    const allSameVisibility = eligibleNodes.every((node) => node.status.isVisible === eligibleNodes[0].status.isVisible)

                    for (const node of eligibleNodes) {
                        node.status.isVisible = allSameVisibility ? !node.status.isVisible : false
                    }

                    saveDocument(state)
                })

                break
            }
            case 'v':
            case 'V': {
                if (!isCtrl(e)) {
                    return
                }

                pasteFromClipboard()

                break
            }
            case 'y':
            case 'Y': {
                if (!isCtrl(e)) {
                    return
                }

                redo()

                break
            }
            case 'z':
            case 'Z': {
                if (!isCtrl(e)) {
                    return
                }

                undo()

                break
            }
            default: {
                // console.log(`Unhandled keypress [${e.key}]`)
            }
        }
    }, [isEditable])

    const handleKeyUp = useCallback((e: KeyboardEvent): void => {
        switch (e.key) {
            case 'Alt': {
                e.preventDefault()

                if (useStore.getState().registry.drag.isActive) {
                    toggleDragCopy(!useStore.getState().registry.drag.isCopyActive)
                }

                break
            }
        }
    }, [isEditable])

    const documentRef = useDocumentRef()

    useImperativeEvent(documentRef, 'keydown', handleKeyDown)
    useImperativeEvent(documentRef, 'keyup', handleKeyUp)
}
