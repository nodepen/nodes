import { useDocumentRef, useImperativeEvent } from '@/hooks'
import { useDispatch } from '@/store'
import { expireSolution } from '@/store/utils'
import { useCallback, useRef } from 'react'
import { useStore } from '$'

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
            case 'q':
            case 'Q': {
                if (!e.ctrlKey) {
                    return
                }

                apply((state) => {
                    for (const nodeInstanceId of state.registry.selection.nodes) {
                        console.log({ nodeInstanceId })
                        state.document.nodes[nodeInstanceId].status.isVisible = !state.document.nodes[nodeInstanceId].status.isVisible
                    }
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
