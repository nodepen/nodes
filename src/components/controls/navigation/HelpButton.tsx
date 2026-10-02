import React, { useCallback } from 'react'
import { NavigationButton, NavigationIcon } from '../common'

export const HelpButton = (): React.ReactElement => {
  const handleClick = useCallback((_e: React.MouseEvent<HTMLButtonElement>) => {
    console.log('HelpButton')
  }, [])

  const d =
    'M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z'

  return <NavigationButton onClick={handleClick}>{<NavigationIcon d={d} />}</NavigationButton>
}
