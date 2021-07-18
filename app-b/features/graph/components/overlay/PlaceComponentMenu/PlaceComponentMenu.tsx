import React, { useCallback, useState } from 'react'
import { useGraphDispatch } from 'features/graph/store/graph/hooks'
import { OverlayPortal } from '../OverlayPortal'
import { OverlayContainer } from '../OverlayContainer'
import { useGraphManager } from 'context/graph'
import { useOverlayOffset } from '../hooks'
import { useKeyboardSelection, useLibraryShortcuts, useLibraryTextSearch, useSelectedComponent } from './hooks'
import { Grasshopper } from '@/../lib-b/dist'

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

  const [hoverTemplate, setHoverTemplate] = useState<Grasshopper.Component>()

  const selected = useSelectedComponent(candidates, offset, shortcutTemplate, hoverTemplate)

  const autocomplete =
    offset === 0 && !hoverTemplate && exactMatchTemplate
      ? `${userValue}${exactMatchTemplate.name.substr(userValue.length)}`
      : ''

  return (
    <OverlayPortal>
      <OverlayContainer static position={[0, 0]}>
        <div className="w-full h-full flex flex-col p-2 pb-12 bg-green pointer-events-auto">
          <div className="w-full h-12 mb-2 flex items-center">
            <div className="w-full h-10 relative rounded-md bg-pale overflow-hidden">
              <div id="buttons" className="w-full h-full absolute z-10 pointer-events-none">
                <div className="w-full h-full relative z-10">
                  <div className="absolute w-10 h-10 left-0 top-0 z-60">
                    <div className="w-full h-full flex items-center justify-center">
                      {selected ? (
                        <img src={`data:image/png;base64,${selected.icon}`} />
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-green border-dashed" />
                      )}
                    </div>
                  </div>
                  <div className="absolute h-10 w-20 top-0 right-0 z-60">
                    <div className="inline-block w-10 h-10">
                      <div className="w-full h-full flex justify-end items-center">
                        <button className="w-6 h-6 flex items-center justify-center rounded-full border-2 border-darkgreen  pointer-events-auto">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                              vectorEffect="non-scaling-stroke"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="inline-block w-10 h-10">
                      <div className="w-full h-full flex justify-center items-center">
                        <button className="w-6 h-6 flex items-center justify-center rounded-full border-2 border-darkgreen overflow-hidden  pointer-events-auto">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                              vectorEffect="non-scaling-stroke"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div id="inputs" className="w-full h-full absolute z-0">
                <div className="w-full h-full relative z-0">
                  <input
                    className="absolute h-full w-full pl-10 left-0 top-0 bg-pale text-lg z-50"
                    //style={{ width: 'calc(100% - 80px)' }}
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
                    className="absolute w-full h-full pl-10 bg-transparent left-0 top-0 z-40 text-lg text-swampgreen pointer-events-none"
                    disabled
                  />
                </div>
              </div>
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
            <div
              className="w-full flex-grow flex flex-col overflow-y-auto no-scrollbar"
              onMouseLeave={() => setHoverTemplate(undefined)}
            >
              {candidates.map((component, i) => (
                <button
                  key={`sort-option-${component.name}-${i}`}
                  className={`${
                    i === offset && !hoverTemplate ? 'bg-swampgreen' : ''
                  } w-full h-8 flex items-center rounded-md hover:bg-swampgreen`}
                  onMouseEnter={() => setHoverTemplate(component)}
                >
                  <div className="w-10 h-8 flex items-center justify-center">
                    <img width="18" height="18" src={`data:image/png;base64,${component.icon}`} />
                  </div>
                  <p>{component.name}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </OverlayContainer>
    </OverlayPortal>
  )
}
