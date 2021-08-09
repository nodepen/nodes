import React, { useEffect } from 'react'
import { useGraphDispatch, useGraphElements } from '../../store/graph/hooks'
import { useSelectionHotkey } from '../../store/hotkey/hooks'

const SelectionHotkeyObserver = (): React.ReactElement => {
  const action = useSelectionHotkey()

  const elements = useGraphElements()
  const { updateSelection } = useGraphDispatch()

  useEffect(() => {
    switch (action) {
      case 'select-all': {
        const ids = Object.values(elements)
          .filter((element) => element.template.type === 'static-component')
          .map((element) => element.id)
        updateSelection({ type: 'id', ids, mode: 'default' })
        break
      }
      case 'deselect-all': {
        updateSelection({ type: 'id', ids: [], mode: 'default' })
        break
      }
    }
  }, [action])

  return <></>
}

export default React.memo(SelectionHotkeyObserver)
