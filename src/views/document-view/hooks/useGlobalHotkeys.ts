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
        console.log(useStore.getState().document)
        break
      }
      case 'Delete':
      case 'Backspace': {
        apply((state) => {
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
      default: {
        // console.log(`Unhandled keypress [${e.key}]`)
      }
    }
  }, [])

  const documentRef = useDocumentRef()

  useImperativeEvent(documentRef, 'keydown', handleKeyDown)
}
