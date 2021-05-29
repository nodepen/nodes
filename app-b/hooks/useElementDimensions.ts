import { RefObject, useEffect, useState } from 'react'

type ElementDimensions = {
  width?: number
  height?: number
}

export const useElementDimensions = (target: RefObject<HTMLDivElement | HTMLButtonElement>): ElementDimensions => {
  const [dimensions, setDimensions] = useState<ElementDimensions>()

  useEffect(() => {
    if (!target.current) {
      return
    }

    const { width, height } = target.current.getBoundingClientRect()

    setDimensions({ width, height })
  }, [target])

  return dimensions ?? {}
}
