import { useDocumentRef, useImperativeEvent } from '@/hooks'
import { useDispatch } from '@/store'
import { expireSolution } from '@/store/utils'
import { useCallback, useRef } from 'react'
import { useStore } from '$'
import { getNodeTypeForTemplate } from '@/utils/templates/getNodeTypeForTemplate'
import { saveDocument } from '@/store/utils/saveDocument'

export const useGlobalHotkeys = () => {
    const { apply } = useDispatch()

    const handleKeyDown = useCallback((e: KeyboardEvent): void => {
        console.log
        switch (e.key) {
            case ' ': {
                console.log({
                    document: useStore.getState().document,
                    solution: useStore.getState().solution
                })
                break
            }
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
            case 'a':
            case 'A': {
                if (!e.ctrlKey) {
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
            case 'q':
            case 'Q': {
                if (!e.ctrlKey) {
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
            default: {
                // console.log(`Unhandled keypress [${e.key}]`)
            }
        }
    }, [])

    const documentRef = useDocumentRef()

    useImperativeEvent(documentRef, 'keydown', handleKeyDown)
}
