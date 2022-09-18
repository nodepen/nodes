import React, { useCallback } from 'react'
import { useState, useRef, useEffect } from 'react'
import { ShadowPortal } from './ShadowPortal'
import { useStore } from '$'

type ShadowProps = {
  target: React.RefObject<HTMLDivElement>
}

type ShadowDimensions = {
  left: number
  top: number
  width: number
  height: number
}

const Shadow = ({ target }: ShadowProps): React.ReactElement | null => {
  const canvasRootRef = useStore((store) => store.registry.canvasRoot)
  const [dimensions, setDimensions] = useState<ShadowDimensions>()

  const resizeObserver = useRef<ResizeObserver>()

  const handleShadowResize = useCallback(() => {
    console.log(
      `⚙️ Resizing shadow for [${target.current?.id?.length ?? 0 > 1 ? target.current?.id : 'anonymous element'}]`
    )

    const rootElement = canvasRootRef.current ?? document.documentElement
    const targetElement = target.current

    if (!targetElement) {
      return
    }

    const SHADOW_OFFSET = 4

    const { top: offsetTop, left: offsetLeft } = rootElement.getBoundingClientRect()
    const { width, height, top, left } = targetElement.getBoundingClientRect()

    const { width: currentWidth, height: currentHeight } = dimensions ?? {}

    if (width === currentWidth && height === currentHeight) {
      return
    }

    setDimensions({
      left: left - SHADOW_OFFSET - offsetLeft,
      top: top + SHADOW_OFFSET - offsetTop,
      width,
      height,
    })
  }, [dimensions])

  useEffect(() => {
    resizeObserver.current = new ResizeObserver(handleShadowResize)
  }, [handleShadowResize])

  useEffect(() => {
    const element = target.current
    const observer = resizeObserver.current

    if (!element || !observer) {
      return
    }

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  })

  if (!dimensions) {
    return null
  }

  return (
    <ShadowPortal>
      <div className="np-w-full np-h-full np-relative">
        <div
          className="np-absolute np-rounded-md np-opacity-30 np-border-2 np-border-swampgreen np-bg-none"
          style={dimensions}
        />
      </div>
    </ShadowPortal>
  )
}

export default React.memo(Shadow)
