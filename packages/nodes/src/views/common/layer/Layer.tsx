import React from 'react'
import { useActiveViewTransform } from '@/hooks'

type LayerProps = {
  id: string
  tab?: 'graph' | 'model'
  /** If `true`, layer is always rendered in the same position. */
  fixed?: boolean
  z: number
  children?: React.ReactNode
}

export const Layer = ({ id, tab, z, fixed = false, children }: LayerProps): React.ReactElement => {
  const activeTabDelta = useActiveViewTransform(tab)
  const transform = fixed ? 0 : activeTabDelta * 100

  return (
    <div
      id={id}
      className="np-w-full np-h-full np-absolute np-pointer-events-none np-overflow-hidden"
      style={{
        zIndex: z,
        transition: 'transform',
        transitionDuration: '300ms',
        transitionTimingFunction: 'ease-out',
        transform: `translateX(${transform}%)`,
      }}
    >
      {children}
    </div>
  )
}
