import { useCallback } from 'react'
import { useDispatch, useStore } from '$'

/**
 * Given a reference to a File Path param's port, return a callback that asks the host to pick a file and sets it as the port's value.
 * @remarks Returns `null` if the host has not provided an `onPickFile` callback.
 * @param nodeInstanceId
 * @param portInstanceId
 */
export const usePickFile = (nodeInstanceId: string, portInstanceId: string): (() => void) | null => {
    const { setFileValue } = useDispatch()

    const isPickFileEnabled = useStore((state) => {
        return !!state.callbacks.onPickFile
    })

    const handlePickFile = useCallback(() => {
        const state = useStore.getState()

        state.callbacks.onPickFile?.(state, { nodeInstanceId, portInstanceId })
            .then((file) => {
                if (file) {
                    setFileValue(nodeInstanceId, portInstanceId, file)
                }
            })
            .catch((e) => {
                console.warn('🐍 Could not pick a file:', e)
            })
    }, [nodeInstanceId, portInstanceId, setFileValue])

    return isPickFileEnabled ? handlePickFile : null
}
