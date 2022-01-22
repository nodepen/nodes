import React, { useCallback, useEffect } from 'react'
import { useGraphDispatch } from '../../store/graph/hooks'
import { useCopyPasteHotkey } from '../../store/hotkey/hooks'

const CopyPasteObserver = (): React.ReactElement => {
  const action = useCopyPasteHotkey()

  const { copySelection, paste } = useGraphDispatch()

  useEffect(() => {
    switch (action) {
      case 'copy':
        console.log('Copy!')
        copySelection()
        return
      case 'paste':
        console.log('Paste!')
        paste()
        return
    }
  }, [action])

  return <></>
}

export default React.memo(CopyPasteObserver)
