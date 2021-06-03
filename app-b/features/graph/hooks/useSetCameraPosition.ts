import { useGraphManager } from '@/context/graph'
import { useCallback, useRef } from 'react'
import { useCameraDispatch, useCameraPosition } from '../store/hooks'

export const useSetCameraPosition = (): ((x: number, y: number) => Promise<void>) => {
  const {
    registry: { setTransform },
  } = useGraphManager()
  const { setPosition } = useCameraDispatch()
  const startPosition = useCameraPosition()

  const startTime = useRef<number>(0)
  const duration = useRef<number>(350)

  const setCameraPosition = useCallback(
    (x: number, y: number) => {
      return new Promise<void>((resolve, reject) => {
        if (!setTransform) {
          reject()
          return
        }

        // console.log({ start: startPosition })
        // console.log({ to: [x, y] })

        startTime.current = Date.now()

        // Trigger library move
        setTransform(x, y, 1, duration.current, 'easeInOutQuint')

        // Begin parallel camera position move
        const xDelta = x - startPosition[0]
        const yDelta = y - startPosition[1]

        const animate = (t: number): void => {
          const easeInOutQuint = (t: number): number => {
            return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t
          }

          const remap = (t: number): number => {
            return easeInOutQuint(t) / easeInOutQuint(1)
          }

          const f = remap(t)

          const xPosition = startPosition[0] + xDelta * f
          const yPosition = startPosition[1] + yDelta * f

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
        }, 5)
      })
    },
    [startPosition]
  )

  return setCameraPosition
}
