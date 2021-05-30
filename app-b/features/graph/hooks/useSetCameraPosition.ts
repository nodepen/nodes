import { useCallback, useRef } from 'react'
import { useCameraRegistry, useCamera, useCameraDispatch } from '../store/hooks'

type SetCameraPositionContext = {
  setCameraPosition: (x: number, y: number) => Promise<void>
  isMoving: boolean
}

export const useSetCameraPosition = (): SetCameraPositionContext => {
  const { setTransform } = useCameraRegistry()
  const { setPosition } = useCameraDispatch()
  const { position, zoom } = useCamera()

  const startPosition = useRef<[number, number]>([0, 0])
  const startTime = useRef<number>(0)
  const duration = useRef<number>(150)

  const setCameraPosition = useCallback((x: number, y: number) => {
    return new Promise<void>((resolve, reject) => {
      if (!setTransform) {
        reject()
        return
      }

      const moveStartPosition = position
      const moveStartTime = Date.now()

      startPosition.current = moveStartPosition
      startTime.current = moveStartTime

      // Trigger library move
      setTransform(x, y, zoom.static, duration.current, 'easeInOutQuint')

      // Begin parallel camera position move
      const xDelta = x - startPosition.current[0]
      const yDelta = y - startPosition.current[1]

      const animate = (t: number): void => {
        const easeInOutQuint = (t: number): number => {
          return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t
        }

        const remap = (t: number): number => {
          return easeInOutQuint(t) / easeInOutQuint(1)
        }

        const f = remap(t)

        const xPosition = startPosition.current[0] + xDelta * f
        const yPosition = startPosition.current[1] + yDelta * f

        setPosition([xPosition, yPosition])
      }

      const i = setInterval(() => {
        const f = Date.now()

        if (f >= startTime.current + duration.current) {
          clearInterval(i)
          animate(1)
          resolve()
          return
        }

        const t = (f - startTime.current) / duration.current

        animate(t)
      }, 50)
    })
  }, [])

  return { isMoving: false, setCameraPosition }
}
