import React, { useEffect } from 'react'
import { useGraphDispatch, useGraphSelection } from '../../store/graph/hooks'
import { useVisibilityHotkey } from '../../store/hotkey/hooks'

const VisibilityHotkeyObserver = (): React.ReactElement => {
  const { toggleVisibility } = useGraphDispatch()
  const selection = useGraphSelection()

  const shouldToggle = useVisibilityHotkey()

  useEffect(() => {
    if (!shouldToggle) {
      return
    }

    toggleVisibility(selection)
  }, [shouldToggle])

  return <></>
}

export default React.memo(VisibilityHotkeyObserver)
