import { useMemo } from 'react'
import { useGraphManager } from '@/features/graph/context/graph'

/**
 * Given a position in screen coordinate space, returns the matching left and top offset
 * position on the overlay container div.
 * @remarks Necessary because the overlay container does not fill the screen, and does some offset trickery.
 */
export const useOverlayOffset = (position: [sx: number, sy: number]): [left: number, top: number] => {
  const { registry } = useGraphManager()

  const offsetTop = registry.layoutContainerRef?.current?.offsetTop ?? 0

  const offsetPosition = useMemo(() => {
    const [sx, sy] = position
    return [sx, sy - offsetTop] as [number, number]
  }, [])

  return offsetPosition
}
