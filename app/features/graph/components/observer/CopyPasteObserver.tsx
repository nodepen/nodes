import React, { useCallback, useEffect } from 'react'
import { useGraphDispatch } from '../../store/graph/hooks'
import { useCopyPasteHotkey } from '../../store/hotkey/hooks'

const CopyPasteObserver = (): React.ReactElement => {
  const action = useCopyPasteHotkey()

  useEffect(() => {
    switch (action) {
      case 'copy':
        console.log('Copy!')
        return
      case 'paste':
        console.log('Paste!')
        return
    }
  }, [action])

  return <></>
}

export default React.memo(CopyPasteObserver)
