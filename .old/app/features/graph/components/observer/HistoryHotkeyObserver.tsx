import React, { useEffect } from 'react'
import { useGraphDispatch } from '../../store/graph/hooks'
import { useHistoryHotkey } from '../../store/hotkey/hooks'

const HistoryHotkeyObserver = (): React.ReactElement => {
  const action = useHistoryHotkey()

  const { undo, redo } = useGraphDispatch()

  useEffect(() => {
    switch (action) {
      case 'undo': {
        undo()
        break
      }
      case 'redo': {
        redo()
        break
      }
    }
  }, [action])

  return <></>
}

export default React.memo(HistoryHotkeyObserver)
