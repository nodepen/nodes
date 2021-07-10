import { useCameraStaticZoom } from 'features/graph/store/camera/hooks'
import { RefObject, useEffect, useState } from 'react'

type ElementDimensions = {
  width?: number
  height?: number
}

export const useElementDimensions = (target: RefObject<HTMLDivElement | HTMLButtonElement>): ElementDimensions => {
  const [dimensions, setDimensions] = useState<ElementDimensions>()
  const zoom = useCameraStaticZoom()

  useEffect(() => {
    if (!target.current) {
      return
    }

    const { width, height } = target.current.getBoundingClientRect()

    setDimensions({ width: width / zoom, height: height / zoom })
  }, [target])

  return dimensions ?? {}
}
