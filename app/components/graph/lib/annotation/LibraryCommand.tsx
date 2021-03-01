import React, { useMemo, useState, useEffect, useRef } from 'react'
import { useGraphManager } from '@/context/graph'

type LibraryCommandProps = {
  onDestroy: () => void
}

export const LibraryCommand = ({ onDestroy }: LibraryCommandProps): React.ReactElement => {
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

  const options = [...installed]
    .sort((a, b) => levDist(search, a.name) - levDist(search, b.name))
    .slice(0, 5)
    .reverse()

  return (
    <div className="w-24 flex flex-col items-center" ref={menuRef}>
      {options.map((option, i) => (
        <p className="whitespace-no-wrap" key={`search-opt-${option}-${i}`}>
          {option.name}
        </p>
      ))}
      <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} />
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
