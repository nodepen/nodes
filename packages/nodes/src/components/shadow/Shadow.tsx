import React from 'react'
import { useImperativeEvent } from '@/hooks'
import { useState, useLayoutEffect, useCallback } from 'react'
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

  const updateShadowDimensions = useCallback(() => {
    const root = canvasRootRef.current ?? document.documentElement
    const element = target.current

    if (!element) {
      return
    }

    const SHADOW_OFFSET = 4

    const { top: offsetTop, left: offsetLeft } = root.getBoundingClientRect()
    const { width, height, top, left } = element.getBoundingClientRect()

    setDimensions({
      left: left - SHADOW_OFFSET - offsetLeft,
      top: top + SHADOW_OFFSET - offsetTop,
      width,
      height,
    })
  }, [target])

  useLayoutEffect(() => {
    updateShadowDimensions()
  }, [])

  useImperativeEvent(target, 'resize', updateShadowDimensions)

  if (!dimensions) {
    return null
  }

  //   -4px 4px 0 0 rgba(123, 191, 165, 0.3)

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
