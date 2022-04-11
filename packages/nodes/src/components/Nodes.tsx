import React, { useRef, useState, useLayoutEffect, useEffect } from 'react'
import '@/styles.css'
import { COLORS } from '@/constants'
import { useStore } from '$'
import { CameraManager } from '@/context'

type NodesProps = {
  library: []
  graph: unknown
  solution: unknown
  onSave?: (graph: unknown) => void
  children?: React.ReactNode
}

export const Nodes = (): React.ReactElement => {
  const rootRef = useRef<HTMLDivElement>(null)

  const cameraProps = useCameraProps(rootRef)

  return (
    <div className="np-w-full np-h-full" ref={rootRef}>
      <CameraManager>
        <svg {...cameraProps} className="np-overflow-visible">
          <line x1={0} y1={0} x2={250} y2={0} stroke={COLORS.DARK} strokeWidth={2} vectorEffect="non-scaling-stroke" />
          <line x1={0} y1={0} x2={0} y2={-250} stroke={COLORS.DARK} strokeWidth={2} vectorEffect="non-scaling-stroke" />
        </svg>
      </CameraManager>
    </div>
  )
}

type CameraProps = {
  viewBox: string
  width: string
  height: string
}

/**
 * Given the current camera and dimensions of the container in screen space, produce root svg props.
 * @param containerRef
 * @returns `viewBox` `width` `height`
 */
const useCameraProps = (containerRef: React.RefObject<HTMLDivElement>): CameraProps => {
  const { aspect, position, zoom } = useStore((state) => state.camera)

  const [containerDimensions, setContainerDimensions] = useState<{ width: number; height: number }>({
    width: 1920,
    height: 1080,
  })

  useLayoutEffect(() => {
    if (!containerRef.current) {
      return
    }

    const { width, height } = containerRef.current.getBoundingClientRect()

    setContainerDimensions({ width, height })
  }, [])

  const { width: w, height: h } = containerDimensions
  const { x, y } = position

  const viewBox = [(w / 2 - x) / -zoom, (h / 2 + y) / -zoom, w / zoom, h / zoom].join(' ')

  const width = `${w}px`
  const height = `${h}px`

  return { width, height, viewBox }
}
