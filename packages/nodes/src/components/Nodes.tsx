import React, { useRef, useState, useLayoutEffect, useEffect } from 'react'
import '@/styles.css'
import { COLORS } from '@/constants'
import { useStore } from '$'

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

  console.log(cameraProps)

  return (
    <div className="np-w-full np-h-full" ref={rootRef}>
      <svg {...cameraProps}>
        <line x1={0} y1={0} x2={5} y2={5} stroke={COLORS.DARK} strokeWidth={2} vectorEffect="non-scaling-stroke" />
      </svg>
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

  const { width, height } = containerDimensions

  const viewBox = [].join(' ')

  return { width: `${width}px`, height: `${height}px`, viewBox }
}
