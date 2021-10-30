import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { NodePen, Grasshopper } from 'glib'
import { useGraphDispatch } from 'features/graph/store/graph/hooks'
import { OverlayPortal } from '../OverlayPortal'
import { OverlayContainer } from '../OverlayContainer'
import { useGraphManager } from '@/features/graph/context/graph'
import { useSessionManager } from '@/features/common/context/session'
import { useOverlayOffset } from '../hooks'
import { useKeyboardSelection, useLibraryShortcuts, useLibraryTextSearch, useSelectedComponent } from './hooks'
import { useScreenSpaceToCameraSpace } from '@/features/graph/hooks'
import { mapToOrderedCategory } from './utils'
import { addDefaultElement } from 'features/graph/utils'
import { useOutsideClick } from 'hooks'

type PlaceComponentMenuProps = {
  /** Position to place element in screen coordinate space. */
  position: [sx: number, sy: number]
  onClose: () => void
}

export const PlaceComponentMenu = ({
  position: screenPosition,
  onClose,
}: PlaceComponentMenuProps): React.ReactElement => {
  const { addElement } = useGraphDispatch()
  const { library } = useGraphManager()
  const { device } = useSessionManager()

  const isFullWidth = useMemo(() => device.breakpoint === 'sm', [device.breakpoint])

  const libraryByCategory = useMemo(() => {
    return mapToOrderedCategory(library ?? [])
  }, [library])

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!inputRef.current) {
      return
    }

    inputRef.current.focus()
  }, [])

  const handleEscape = useCallback(
    (e: KeyboardEvent): void => {
      switch (e.key.toLowerCase()) {
        case 'escape': {
          onClose()
        }
      }
    },
    [onClose]
  )

  useEffect(() => {
    window.addEventListener('keyup', handleEscape)

    return () => {
      window.removeEventListener('keyup', handleEscape)
    }
  })

  // Only used in large screen context
  const position = useOverlayOffset(screenPosition)
  const mapCoordinates = useScreenSpaceToCameraSpace()

  const handlePlaceComponent = useCallback(
    (
      template: Grasshopper.Component,
      data?: Partial<NodePen.Element<'static-component' | 'number-slider'>['current']>
    ): void => {
      const [x, y] = mapCoordinates(screenPosition)

      addDefaultElement(addElement, [x, y], template, data)
      onClose()
    },
    [screenPosition, mapCoordinates, addElement, onClose]
  )

  const [userValue, setUserValue] = useState<string>('')

  const [candidates, exactMatchTemplate] = useLibraryTextSearch(userValue, library)
  const [shortcut, shortcutTemplate] = useLibraryShortcuts(userValue, library)

  const [offset, setOffset] = useKeyboardSelection(isFullWidth ? 'down' : 'up', !!shortcut)

  const selected = useSelectedComponent(candidates, offset, shortcutTemplate)

  const autocomplete =
    offset === 0 && exactMatchTemplate ? `${userValue}${exactMatchTemplate.name.substr(userValue.length)}` : ''

  const [showFullLibrary, setShowFullLibrary] = useState(false)

  const body = useMemo(() => {
    if (showFullLibrary) {
      return (
        <div className="w-full flex-grow flex flex-col overflow-y-auto no-scrollbar">
          {libraryByCategory.map(([category, components]) => (
            <>
              <div className="w-full pl-2 h-10 sticky top-0 bg-green z-10">
                <div className="w-full h-full flex items-center">
                  <h4
                    className="text-sm mr-2 text-darkgreen font-semibold"
                    style={{ lineHeight: '30px' }}
                  >{`${category[0].toUpperCase()}${category.substring(1)}`}</h4>
                  <div className="flex-grow border-b-2 border-swampgreen" />
                </div>
              </div>
              <div className="w-full grid mb-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(48px, 1fr))' }}>
                {components.map((component, i) => (
                  <button
                    key={`component-button-${component.name}-${i}`}
                    className="relative rounded-sm bg-green hover:bg-swampgreen"
                    style={{ paddingTop: '100%' }}
                    onClick={() => {
                      handlePlaceComponent(component)
                    }}
                  >
                    <div className="absolute top-0 right-0 left-0 bottom-0">
                      <div className="w-full h-full flex items-center justify-center">
                        <img src={`data:image/png;base64,${component.icon}`} />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </>
          ))}
        </div>
      )
    }

    if (shortcut) {
      return (
        <div className={`${isFullWidth ? '' : 'mt-2 mb-2'} w-full flex flex-col`}>
          <div className="w-full h-10 flex items-center justify-start">
            <div className="w-10 h-6 flex items-center justify-center">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h4 className="text-sm text-darkgreen font-semibold">Shortcut</h4>
          </div>
          <div className="w-full pl-10 flex flex-col">
            <div className="mb-2 w-full h-6 flex items-center overflow-hidden whitespace-nowrap">
              <div className="mr-3 pl-3 pr-3 pt-1 pb-1 bg-pale rounded-md">
                <p className="font-panel font-semibold text-xs text-dark">{shortcut.pattern}</p>
              </div>
              <svg
                className="w-4 h-4"
                style={{ minWidth: 16 }}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <img
                width="18"
                height="18"
                className="ml-3"
                src={`data:image/png;base64,${shortcutTemplate?.icon ?? ''}`}
              />
              <p className="ml-2 font-panel font-semibold text-sm whitespace-nowrap">
                {shortcut?.label?.toUpperCase() ?? shortcutTemplate?.name.toUpperCase()}
              </p>
            </div>
            <p className="leading-5">{shortcut.description}</p>
          </div>
        </div>
      )
    }

    return (
      <div
        className={`${isFullWidth ? 'flex-col' : 'flex-col-reverse'} ${
          !isFullWidth && candidates.length > 0 ? 'mt-2' : ''
        } w-full flex-grow flex overflow-y-auto no-scrollbar`}
      >
        {candidates.map((component, i) => (
          <button
            key={`sort-option-${component.name}-${i}`}
            className={`${i === offset ? 'bg-swampgreen' : ''} w-full h-8 flex items-center rounded-md`}
            onMouseEnter={() => {
              setOffset(i)
            }}
            onMouseMove={() => {
              setOffset(i)
            }}
            onClick={() => {
              switch (component.category.toLowerCase()) {
                default: {
                  handlePlaceComponent(component)
                }
              }
            }}
          >
            <div className="w-10 h-8 flex items-center justify-center">
              <img width="18" height="18" src={`data:image/png;base64,${component.icon}`} />
            </div>
            <p>{component.name}</p>
          </button>
        ))}
      </div>
    )
  }, [
    showFullLibrary,
    libraryByCategory,
    shortcut,
    shortcutTemplate,
    candidates,
    handlePlaceComponent,
    offset,
    setOffset,
    isFullWidth,
  ])

  const menuRef = useRef<HTMLDivElement>(null)

  useOutsideClick(menuRef, onClose)

  return (
    <OverlayPortal>
      <OverlayContainer static position={device.breakpoint === 'sm' ? [0, 0] : position} pointerEvents={false}>
        <>
          <div
            className={`${isFullWidth ? 'left-0 top-0 w-full h-full' : 'w-64'} absolute z-20`}
            style={isFullWidth ? {} : { left: -128, bottom: 'calc(100% + 17px)' }}
          >
            <div
              className={`${
                isFullWidth ? 'w-full h-full flex-col pb-12' : 'w-full flex-col-reverse pb-0 rounded-md'
              } flex p-2 pt-0 bg-green pointer-events-auto`}
              ref={menuRef}
            >
              <div className="w-full h-10 mb-2 mt-2 flex items-center">
                <div className="w-full h-10 relative rounded-md bg-pale overflow-hidden">
                  <div id="buttons" className="w-full h-full absolute z-10 pointer-events-none">
                    <div className="w-full h-full relative z-10">
                      <div className="absolute w-10 h-10 left-0 top-0 z-60">
                        <div className="w-full h-full flex items-center justify-center">
                          <button
                            className={`${
                              isFullWidth ? 'hover:bg-green pointer-events-auto' : 'pointer-events-none'
                            } w-8 h-8 flex items-center justify-center rounded-sm bg-pale`}
                            onClick={() => setShowFullLibrary((current) => !current)}
                            disabled={!isFullWidth}
                          >
                            {selected ? (
                              <img src={`data:image/png;base64,${selected.icon}`} />
                            ) : (
                              <div className="w-6 h-6 rounded-full border-2 border-swampgreen border-dashed" />
                            )}
                          </button>
                        </div>
                      </div>
                      {isFullWidth ? (
                        <div className="absolute h-10 w-20 top-0 right-0 z-60 text-right">
                          <div className="inline-block h-10">
                            <div className="w-full h-full flex justify-end items-center">
                              <button
                                className="w-8 h-8 flex items-center justify-center rounded-sm bg-pale hover:bg-green pointer-events-auto"
                                onClick={onClose}
                              >
                                <svg
                                  className="w-6 h-6"
                                  fill="#093824"
                                  viewBox="0 0 20 20"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                          <div className="inline-block h-10 mr-1">
                            <div className="w-full h-full flex justify-end items-center">
                              <button
                                className={`${
                                  selected ? 'hover:bg-green' : ''
                                } w-8 h-8 flex items-center justify-center rounded-sm bg-pale pointer-events-auto`}
                                disabled={!selected}
                                onClick={() => {
                                  if (!selected) {
                                    return
                                  }

                                  switch (selected.category.toLowerCase()) {
                                    default: {
                                      handlePlaceComponent(selected)
                                    }
                                  }
                                }}
                              >
                                <svg
                                  className="w-6 h-6"
                                  fill={selected ? '#093824' : '#98E2C6'}
                                  viewBox="0 0 20 20"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div id="inputs" className="w-full h-full absolute z-0">
                    <div className="w-full h-full relative z-0">
                      <input
                        className="absolute h-full w-full pl-10 left-0 top-0 bg-transparent text-lg z-50 no-outline"
                        ref={inputRef}
                        value={userValue}
                        onChange={(e) => setUserValue(e.target.value)}
                        onKeyDown={(e) => {
                          switch (e.key.toLowerCase()) {
                            case 'a': {
                              e.stopPropagation()
                              break
                            }
                            case 'arrowdown': {
                              e.preventDefault()
                              return
                            }
                            case 'arrowup': {
                              e.preventDefault()
                              return
                            }
                            case 'enter': {
                              if (!selected) {
                                return
                              }

                              if (shortcut) {
                                const data = shortcut.onCreate(userValue)
                                handlePlaceComponent(selected, data)
                                return
                              }

                              handlePlaceComponent(selected)

                              return
                            }
                          }
                        }}
                      />
                      <input
                        value={autocomplete}
                        className="absolute w-full h-full pl-10 bg-transparent left-0 top-0 z-40 text-lg text-swampgreen bg-pale pointer-events-none"
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </div>
              {body}
            </div>
          </div>
          {isFullWidth ? null : (
            <div
              className="w-6 h-6 rounded-sm absolute bg-green"
              style={{ left: -12, top: -14 - 17, transform: 'rotate(45deg)' }}
            />
          )}
        </>
      </OverlayContainer>
    </OverlayPortal>
  )
}
