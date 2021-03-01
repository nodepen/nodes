import React, { useMemo, useState, useEffect, useRef } from 'react'
import { Grasshopper } from 'glib'
import { useGraphManager } from '@/context/graph'
import { Tooltip } from './Tooltip'

type LibraryCommandProps = {
  position: [number, number]
  onDestroy: () => void
}

export const LibraryCommand = ({ position, onDestroy }: LibraryCommandProps): React.ReactElement => {
  const {
    store: { library },
    dispatch,
  } = useGraphManager()

  const installed = useMemo(() => {
    return Object.values(library)
      .map((val) => Object.values(val).reduce((all, current) => [...all, ...current], []))
      .reduce((all, current) => [...all, ...current], [])
  }, [library])

  const menuRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!inputRef.current) {
      return
    }

    inputRef.current.focus()
  }, [])

  const handlePointerDown = (e: PointerEvent): void => {
    if (!menuRef.current) {
      return
    }

    // If there is a click outside of the menu, destroy it
    if (!menuRef.current.contains(e.target as any)) {
      onDestroy()
    }
  }

  useEffect(() => {
    window.addEventListener('pointerdown', handlePointerDown)

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown)
    }
  })

  const [search, setSearch] = useState('')

  const options =
    search.length > 0
      ? [...installed]
          .sort((a, b) => levDist(search, a.name) - levDist(search, b.name))
          .slice(0, 5)
          .reverse()
      : []

  const handlePlaceComponent = (component: Grasshopper.Component): void => {
    if (component.category.toLowerCase() === 'params') {
      switch (component.name.toLowerCase()) {
        case 'panel': {
          dispatch({ type: 'graph/add-panel', position })
          break
        }
        case 'number slider': {
          dispatch({ type: 'graph/add-number-slider', position })
          break
        }
        default: {
          dispatch({ type: 'graph/add-parameter', position, component })
        }
      }
    } else {
      dispatch({ type: 'graph/add-component', position, component })
    }

    onDestroy()
  }

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent): void => {
      if (e.code === 'Enter') {
        handlePlaceComponent(options[4])
      }
    }

    window.addEventListener('keypress', handleKeyPress)

    return () => {
      window.removeEventListener('keypress', handleKeyPress)
    }
  })

  const handlePointerOver = (e: React.PointerEvent<HTMLButtonElement>, component: Grasshopper.Component): void => {
    const { pageX, pageY } = e

    const tooltip = <Tooltip component={component} onDestroy={() => ''} />

    dispatch({ type: 'tooltip/set-tooltip', position: [pageX + 5, pageY], content: tooltip })
  }

  const handlePointerLeave = (): void => {
    dispatch({ type: 'tooltip/clear-tooltip' })
  }

  return (
    <div
      className="w-48 h-64 flex flex-col items-center"
      ref={menuRef}
      style={{ transform: 'translate(-96px, -240px)' }}
    >
      <div
        className="w-full flex-grow p-2 bg-pale border-2 border-green rounded-md flex flex-col justify-between"
        onPointerLeave={handlePointerLeave}
      >
        <div className="w-full flex-grow flex flex-col justify-between">
          {options.map((option, i) => (
            <button
              key={`lib-opt-${option.nickname}-${i}`}
              onClick={() => handlePlaceComponent(option)}
              className="w-full h-6 p-2 mt-1 rounded-sm hover:bg-green flex items-center"
              onPointerMove={(e) => handlePointerOver(e, option)}
              onPointerLeave={handlePointerLeave}
            >
              <img
                width="18px"
                height="18px"
                draggable="false"
                src={`data:image/png;base64,${option.icon}`}
                alt={option.name}
                className="mr-4"
              />
              <p className="whitespace-no-wrap text-md select-none" style={{ transform: 'translateY(-1px)' }}>
                {option.name}
              </p>
            </button>
          ))}
        </div>
        <input
          type="text"
          className="mt-2 mb-1 pl-2 pr-2 rounded-md border-2 border-dark shadow-osm"
          ref={inputRef}
          value={search}
          placeholder="Search..."
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="w-full h-8 flex justify-center items-center" style={{ transform: 'translateY(-2px)' }}>
        <svg width="32" height="32" viewBox="0 5 10 10">
          <polyline
            points="5,1 9,5 5,9 1,5 5,1"
            fill="#eff2f2"
            stroke="#98E2C6"
            strokeWidth="2px"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
    </div>
  )
}

// Based on implementation by user `andrei-m` on github (thank you!)
// https://gist.github.com/andrei-m/982927
// Available under MIT License
const levDist = (a: string, b: string): number => {
  if (a.length == 0) return b.length
  if (b.length == 0) return a.length

  const matrix = []

  // increment along the first column of each row
  let i
  for (i = 0; i <= b.length; i++) {
    matrix[i] = [i]
  }

  // increment each column in the first row
  let j
  for (j = 0; j <= a.length; j++) {
    matrix[0][j] = j
  }

  // Fill in the rest of the matrix
  for (i = 1; i <= b.length; i++) {
    for (j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) == a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1
          )
        ) // deletion
      }
    }
  }

  return matrix[b.length][a.length]
}
