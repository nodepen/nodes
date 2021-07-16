import React, { useMemo, useState } from 'react'
import { useGraphDispatch } from 'features/graph/store/graph/hooks'
import { OverlayPortal } from '../OverlayPortal'
import { OverlayContainer } from '../OverlayContainer'
import { useGraphManager } from 'context/graph'
import { useOverlayOffset } from '../hooks'
import { levenshteinDistance, matchShortcut } from './utils'

type PlaceComponentMenuProps = {
  /** Position to place element in screen coordinate space. */
  position: [sx: number, sy: number]
  onClose: () => void
}

export const PlaceComponentMenu = ({ position: screenPosition }: PlaceComponentMenuProps): React.ReactElement => {
  const { addElement } = useGraphDispatch()
  const { library, registry } = useGraphManager()

  const position = useOverlayOffset(screenPosition)

  const [userValue, setUserValue] = useState<string>('')

  const shortcut = matchShortcut(userValue)

  const libraryNames = useMemo(() => {
    return library?.map((component) => component.name) ?? []
  }, [library])

  const sortedCandidates = useMemo(() => {
    if (!userValue || userValue.length <= 0) {
      return []
    }

    const candidates = [...libraryNames]

    return candidates.sort((a, b) => levenshteinDistance(a, userValue) - levenshteinDistance(b, userValue))
  }, [libraryNames, userValue])

  const exactMatch = sortedCandidates.find((candidate) => candidate.toLowerCase().indexOf(userValue.toLowerCase()) == 0)

  if (exactMatch) {
    sortedCandidates.splice(
      sortedCandidates.findIndex((candidate) => candidate === exactMatch),
      1
    )
  }

  const displayCandidates = (exactMatch ? [exactMatch, ...sortedCandidates] : sortedCandidates).slice(0, 15)
  const displayExactMatch = exactMatch ? `${userValue}${exactMatch.substr(userValue.length)}` : ''

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
                value={displayExactMatch}
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
          ) : null}
          <div className="w-full flex flex-col">
            {displayCandidates.map((name, i) => (
              <p key={`sort-option-${name}-${i}`}>{name}</p>
            ))}
          </div>
        </div>
      </OverlayContainer>
    </OverlayPortal>
  )
}
