import { useState, useEffect } from 'react'
import { useStore } from '$'

type CameraProps = Pick<React.SVGProps<SVGElement>, 'viewBox' | 'width' | 'height'>

/**
 * Given the current camera and dimensions of the container in screen space, produce root svg props.
 * @param containerRef
 * @returns `viewBox` `width` `height`
 */
export const useCameraProps = (): CameraProps => {
  const containerRef = useStore((state) => state.registry.canvasRoot)

  const { position, zoom } = useStore((state) => state.camera)

  const [containerDimensions, setContainerDimensions] = useState<{ width: number; height: number }>({
    width: 1920,
    height: 1080,
  })

  useEffect(() => {
    if (!containerRef.current) {
      return
    }

    const { width, height } = containerRef.current.getBoundingClientRect()

    setContainerDimensions({ width, height })
  }, [])

  const { width: w, height: h } = containerDimensions
  const { x, y } = position

  const viewBox = [w / 2 / -zoom + x, h / 2 / -zoom - y, w / zoom, h / zoom].join(' ')

  const width = `${w}px`
  const height = `${h}px`

  return { width, height, viewBox }
}
