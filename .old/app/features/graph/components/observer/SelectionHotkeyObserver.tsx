import React, { useEffect } from 'react'
import { NodePen } from 'glib'
import { useGraphDispatch, useGraphElements } from '../../store/graph/hooks'
import { useSelectionHotkey } from '../../store/hotkey/hooks'

const SelectionHotkeyObserver = (): React.ReactElement => {
  const action = useSelectionHotkey()

  const elements = useGraphElements()
  const { updateSelection } = useGraphDispatch()

  const selectable: NodePen.ElementType[] = ['static-component', 'static-parameter', 'number-slider', 'panel']

  useEffect(() => {
    switch (action) {
      case 'select-all': {
        const ids = Object.values(elements)
          .filter((element) => selectable.includes(element.template.type))
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
