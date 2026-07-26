import { useDocumentRef, useImperativeEvent } from '@/hooks'
import { useDispatch } from '@/store'
import { expireSolution } from '@/store/utils'
import { useCallback, useRef } from 'react'
import { useStore } from '$'
import { current } from 'immer'
import { getNodeTypeForTemplate } from '@/utils/templates/getNodeTypeForTemplate'
import { saveDocument } from '@/store/utils/saveDocument'
import { isCtrl } from '@/utils/dom/isCtrl'

export const useGlobalHotkeys = () => {
    const { apply, clearInterface, clearSelection, clearModelState, toggleDragCopy, pasteFromClipboard, commitModelSelection } = useDispatch()

    const handleKeyDown = useCallback((e: KeyboardEvent): void => {
        switch (e.key) {
            case ' ': {
                console.log({
                    document: useStore.getState().document,
                    solution: useStore.getState().solution
                })

                break
            }
            case 'Control':
            case 'Meta':
                break
            case 'Alt':
                if (useStore.getState().registry.drag.isActive) {
                    e.preventDefault()
                    toggleDragCopy(!useStore.getState().registry.drag.isCopyActive)
                }

                break
            case 'Delete':
            case 'Backspace': {
                apply((state) => {
                    if (Object.keys(state.registry.contextMenus ?? {}).length > 0) {
                        return
                    }

                    if (state.registry.selection.nodes.length === 0) {
                        return
                    }

                    for (const id of state.registry.selection.nodes) {
                        delete state.document.nodes[id]
                    }

                    expireSolution(state)
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

                        switch (getNodeTypeForTemplate(template)) {
                            case 'generic-node':
                            case 'generic-parameter':
                            case 'number-slider':
                            case 'panel': {
                                selection.push(node.instanceId)
                            }
                        }
                    }
                    state.registry.selection.nodes = selection
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
                    state.clipboard.nodes = state.registry.selection.nodes.map((id) => current(state.document.nodes[id]))
                })

                break
            }
            case 'q':
            case 'Q': {
                if (!isCtrl(e)) {
                    return
                }

                apply((state) => {
                    for (const nodeInstanceId of state.registry.selection.nodes) {
                        const node = state.document.nodes[nodeInstanceId]
                        const template = state.templates[node.templateId]

                        switch (getNodeTypeForTemplate(template)) {
                            case 'generic-node': {
                                state.document.nodes[nodeInstanceId].status.isVisible = !state.document.nodes[nodeInstanceId].status.isVisible
                                break;
                            }
                            default: {
                                // Cannot enable/disable some components
                                break;
                            }
                        }
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
            default: {
                // console.log(`Unhandled keypress [${e.key}]`)
            }
        }
    }, [])

    const handleKeyUp = useCallback((e: KeyboardEvent): void => {
        switch (e.key) {
            case 'Alt': {
                e.preventDefault()
            }
        }
    }, [])

    const documentRef = useDocumentRef()

    useImperativeEvent(documentRef, 'keydown', handleKeyDown)
    useImperativeEvent(documentRef, 'keyup', handleKeyUp)
}
