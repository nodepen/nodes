import React, { useCallback } from 'react'
import { NavigationButton, NavigationIcon } from '../common'

export const DownloadButton = (): React.ReactElement => {
  const handleClick = useCallback((_e: React.MouseEvent<HTMLButtonElement>) => {
    console.log('DownloadButton')
  }, [])

  const d = 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4'

  return <NavigationButton onClick={handleClick}>{<NavigationIcon d={d} />}</NavigationButton>
}
