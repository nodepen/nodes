import { useGraphManager } from '@/features/graph/context/graph'
import { useCallback, useRef } from 'react'
import { useCameraDispatch, useCameraStaticPosition } from '../store/camera/hooks'

type CameraAnchor = 'NONE' | 'TL' | 'TR' | 'C'

export const useSetCameraPosition = (): ((
  x: number,
  y: number,
  anchor?: CameraAnchor,
  offset?: number,
  duration?: number,
  zoom?: number
) => Promise<void>) => {
  const {
    registry: { setTransform },
  } = useGraphManager()
  const { setStaticPosition, setStaticZoom } = useCameraDispatch()
  const startPosition = useCameraStaticPosition()

  const startTime = useRef<number>(0)

  /**
   * Have camera 'look at' position on graph relative to a screen anchor position.
   * @remarks `offset` has no effect on `C` anchor
   */
  const setCameraPosition = useCallback(
    (x: number, y: number, anchor: CameraAnchor = 'C', offset = 0, duration = 350, zoom = 1) => {
      return new Promise<void>((resolve, reject) => {
        if (!setTransform) {
          reject()
          return
        }

        const [w, h] = [window.innerWidth, window.innerHeight - 48 - 36]

        const [dx, dy] = ((): [number, number] => {
          switch (anchor) {
            case 'NONE': {
              return [0, 0]
            }
            case 'C': {
              return [w / 2, h / 2]
            }
            case 'TL': {
              return [0 + offset, 0 + offset]
            }
            case 'TR': {
              return [w - offset, 0 + offset]
            }
          }
        })()

        const [tx, ty] = [-x + dx, -y + dy]

        // console.log({ start: startPosition })
        // console.log({ to: [x, y] })

        startTime.current = Date.now()

        // Trigger library move
        setTransform(tx, ty, zoom, duration, 'easeInOutQuint')
        setStaticPosition([tx, ty])
        setStaticZoom(zoom)

        resolve()

        // // Begin parallel camera position move
        // const xDelta = tx - startPosition[0]
        // const yDelta = ty - startPosition[1]

        // const animate = (t: number): void => {
        //   const easeInOutQuint = (t: number): number => {
        //     return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t
        //   }

        //   const remap = (t: number): number => {
        //     return easeInOutQuint(t) / easeInOutQuint(1)
        //   }

        //   const f = remap(t)

        //   const xPosition = startPosition[0] + xDelta * f
        //   const yPosition = startPosition[1] + yDelta * f

        //   // setLivePosition([xPosition, yPosition])
        // }

        // const i = setInterval(() => {
        //   const f = Date.now()

        //   if (f >= startTime.current + duration.current) {
        //     clearInterval(i)
        //     animate(1)
        //     setStaticPosition([tx, ty])
        //     setStaticZoom(1)
        //     setLiveZoom(1)
        //     resolve()
        //     return
        //   }

        //   const t = (f - startTime.current) / duration.current

        //   animate(t)
        // }, 5)
      })
    },
    [startPosition, setTransform]
  )

  return setCameraPosition
}
