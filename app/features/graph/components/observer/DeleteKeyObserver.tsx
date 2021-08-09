import React, { useCallback, useEffect } from 'react'
import { useGraphDispatch, useGraphSelection } from '../../store/graph/hooks'

const DeleteKeyObserver = (): React.ReactElement => {
  const { deleteElements } = useGraphDispatch()
  const selection = useGraphSelection()

  const handleKeyUp = useCallback(
    (e: KeyboardEvent): void => {
      if (e.key.toLowerCase() !== 'delete') {
        return
      }

      if (selection.length === 0) {
        return
      }

      deleteElements(selection)
    },
    [selection, deleteElements]
  )

  useEffect(() => {
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keyup', handleKeyUp)
    }
  })

  return <></>
}

export default React.memo(DeleteKeyObserver)
