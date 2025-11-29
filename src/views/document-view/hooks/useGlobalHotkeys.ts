import { useImperativeEvent } from '@/hooks'
import { useDispatch } from '@/store'
import { expireSolution } from '@/store/utils'
import { useCallback, useRef } from 'react'

export const useGlobalHotkeys = () => {
  const { apply } = useDispatch()

  const handleKeyDown = useCallback((e: KeyboardEvent): void => {
    switch (e.key) {
      case 'Delete':
      case 'Backspace': {
        apply((state) => {
          // TODO: Also clean up pinned ports
          for (const id of state.registry.selection.nodes) {
            delete state.document.nodes[id]
          }

          expireSolution(state)
        })
        break
      }
      default: {
        // console.log(`Unhandled keypress [${e.key}]`)
      }
    }
  }, [])

  const documentRef = useRef(document as unknown as HTMLElement)

  useImperativeEvent(documentRef, 'keydown', handleKeyDown)
}
