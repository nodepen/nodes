import React, { useCallback, useState } from 'react'
import { useGraphDispatch } from 'features/graph/store/graph/hooks'
import { OverlayPortal } from '../OverlayPortal'
import { OverlayContainer } from '../OverlayContainer'
import { useGraphManager } from 'context/graph'
import { useOverlayOffset } from '../hooks'
import { useKeyboardSelection, useLibraryShortcuts, useLibraryTextSearch, useSelectedComponent } from './hooks'

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

  const handleEnter = useCallback(() => {
    console.log('ok')
  }, [])

  const offset = useKeyboardSelection(handleEnter, 'down', !!shortcut)

  const autocomplete =
    offset === 0 && exactMatchTemplate ? `${userValue}${exactMatchTemplate.name.substr(userValue.length)}` : ''

  const selected = useSelectedComponent(candidates, offset, shortcutTemplate)

  return (
    <OverlayPortal>
      <OverlayContainer static position={[0, 0]}>
        <div className="w-full h-full flex flex-col pl-2 pr-2 bg-green pointer-events-auto">
          <div className="w-full h-12 flex items-center">
            <div className="w-full h-10 relative rounded-md bg-pale overflow-hidden">
              <input
                className="absolute w-full h-full pl-10 bg-transparent left-0 top-0 z-50 text-lg"
                value={userValue}
                onChange={(e) => setUserValue(e.target.value)}
                onKeyDown={(e) => {
                  switch (e.key.toLowerCase()) {
                    case 'arrowdown': {
                      e.preventDefault()
                      return
                    }
                    case 'arrowup': {
                      e.preventDefault()
                      return
                    }
                  }
                }}
              />
              <input
                value={autocomplete}
                className="absolute w-full h-full pl-10 bg-transparent left-0 top-0 z-40 text-lg text-swampgreen"
                disabled
              />
              <div className="absolute w-10 h-10 left-0 top-0 z-60">
                <div className="w-full h-full flex items-center justify-center">
                  {selected ? (
                    <img src={`data:image/png;base64,${selected.icon}`} />
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-green border-dashed" />
                  )}
                </div>
              </div>
              {/* <div className="w-6 h-6 mr-2 rounded-sm bg-swampgreen" />
              <input className="h-6 flex-grow rounded-sm bg-pale" />
              <div className="w-6 h-6 ml-2 rounded-full bg-green" />
              <div className="w-6 h-6 ml-2 rounded-full bg-green" /> */}
            </div>
          </div>
          {shortcut ? (
            <div className="w-full flex flex-col">
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
              </div>
              {shortcut.description}
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
