import React, { useRef, useEffect } from 'react'
import { useStore } from '$'

export const useZoomSubscription = (): React.MutableRefObject<number> => {
  const zoomRef = useRef(useStore.getState().camera.zoom)

  useEffect(() => {
    return useStore.subscribe((state) => {
      zoomRef.current = state.camera.zoom
    })
  }, [])

  return zoomRef
}