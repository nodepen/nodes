import { useCallback } from 'react'
import { useAppStore } from 'features/common/store'
import { useGraphDispatch } from '../store/graph/hooks'

export const useClickSelection = (elementId: string): (() => void) => {
  const store = useAppStore()

  const { updateSelection } = useGraphDispatch()

  const handleClick = useCallback((): void => {
    const { Control, Shift } = store.getState().hotkey

    const mode = Shift && Control ? 'toggle' : Shift ? 'add' : Control ? 'remove' : 'default'

    updateSelection({ type: 'id', ids: [elementId], mode })
  }, [elementId, store, updateSelection])

  return handleClick
}
