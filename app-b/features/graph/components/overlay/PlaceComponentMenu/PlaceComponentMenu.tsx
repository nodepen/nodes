import React, { useCallback, useState } from 'react'
import { useGraphDispatch } from 'features/graph/store/graph/hooks'
import { OverlayPortal } from '../OverlayPortal'
import { OverlayContainer } from '../OverlayContainer'
import { useGraphManager } from 'context/graph'
import { useOverlayOffset } from '../hooks'
import { useKeyboardSelection, useLibraryShortcuts, useLibraryTextSearch } from './hooks'

type PlaceComponentMenuProps = {
  /** Position to place element in screen coordinate space. */
  position: [sx: number, sy: number]
  onClose: () => void
}

export const PlaceComponentMenu = ({ position: screenPosition }: PlaceComponentMenuProps): React.ReactElement => {
  const { addElement } = useGraphDispatch()
  const { library, registry } = useGraphManager()

  // Only used in large screen context
  const position = useOverlayOffset(screenPosition)

  const [userValue, setUserValue] = useState<string>('')

  const [candidates, exactMatchTemplate] = useLibraryTextSearch(userValue, library)
  const [shortcut, shortcutTemplate] = useLibraryShortcuts(userValue, library)

  const autocomplete = exactMatchTemplate ? `${userValue}${exactMatchTemplate.name.substr(userValue.length)}` : ''

  const handleEnter = useCallback(() => {
    console.log('ok')
  }, [])

  const offset = useKeyboardSelection(handleEnter, 'down', !!shortcut)

  return (
    <OverlayPortal>
      <OverlayContainer static position={[0, 0]}>
        <div className="w-full h-full flex flex-col bg-green pointer-events-auto">
          <div className="w-full h-12 p-2">
            <div className="w-full h-full relative rounded-md bg-pale overflow-hidden">
              <input
                className="absolute w-full h-full bg-transparent left-0 top-0 z-50"
                value={userValue}
                onChange={(e) => setUserValue(e.target.value)}
              />
              <input
                value={autocomplete}
                className="absolute w-full h-full left-0 top-0 z-40 text-swampgreen"
                disabled
              />
              {/* <div className="w-6 h-6 mr-2 rounded-sm bg-swampgreen" />
              <input className="h-6 flex-grow rounded-sm bg-pale" />
              <div className="w-6 h-6 ml-2 rounded-full bg-green" />
              <div className="w-6 h-6 ml-2 rounded-full bg-green" /> */}
            </div>
          </div>
          {shortcut ? (
            <div className="w-full h-12 p-2 flex items-center justify-start">
              <div className="w-6 h-6 flex items-center justify-center mr-2">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="mr-2 p-1 rounded-sm bg-swampgreen text-xs font-semibold font-panel text-darkgreen">
                {shortcut.pattern}
              </div>
              <p className="text-sm whitespace-nowrap">{shortcut.description}</p>
            </div>
          ) : (
            <div className="w-full flex flex-col">
              {candidates.map((component, i) => (
                <p className={`${i === offset ? 'bg-darkgreen' : ''}`} key={`sort-option-${component.name}-${i}`}>
                  {component.name}
                </p>
              ))}
            </div>
          )}
        </div>
      </OverlayContainer>
    </OverlayPortal>
  )
}
