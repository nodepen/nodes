import { useCallback } from 'react'
import { useAppStore } from 'features/common/store'
import { useGraphDispatch } from '../store/graph/hooks'

export const useClickSelection = (elementId: string): (() => void) => {
  const store = useAppStore()

  const { updateSelection } = useGraphDispatch()

  const handleClick = useCallback((): void => {
    const { control, shift } = store.getState().hotkey

    const mode = shift && control ? 'toggle' : shift ? 'add' : control ? 'remove' : 'default'

    updateSelection({ type: 'id', ids: [elementId], mode })
  }, [elementId, store, updateSelection])

  return handleClick
}
