import React, { useCallback } from 'react'
import { NavigationButton, NavigationIcon } from '../common'

export const HomeButton = (): React.ReactElement => {
  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    console.log('HomeButton')
  }, [])

  const d =
    'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'

  return <NavigationButton onClick={handleClick}>{<NavigationIcon d={d} />}</NavigationButton>
}
