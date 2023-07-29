import React, { useCallback } from 'react'
import { useState, useRef, useEffect } from 'react'
import { useStore } from '$'
import { useImperativeEvent } from '@/hooks'

type PseudoShadowProps = {
  target: React.RefObject<HTMLDivElement>
  resizeProxyKey?: string
}

type PseudoShadowDimensions = {
  left: number
  top: number
  width: number
  height: number
}

const PseudoShadow = ({ target, resizeProxyKey }: PseudoShadowProps): React.ReactElement | null => {
  const canvasRootRef = useStore((store) => store.registry.canvasRoot)
  const resizeProxyRef = useStore((store) => store.registry.shadows.proxyRefs[resizeProxyKey ?? ''])
  const [dimensions, setDimensions] = useState<PseudoShadowDimensions>()

  const resizeObserver = useRef<ResizeObserver>()

  const handleShadowResize = useCallback(() => {
    console.log(`⚙️⚙️⚙️ Resized shadow for [${target.current?.id?.length ?? 0 > 1 ? target.current?.id : 'anonymous'}]`)

    const rootElement = canvasRootRef.current ?? document.documentElement
    const targetElement = target.current

    if (!targetElement) {
      return
    }

    const SHADOW_OFFSET = 4

    const { top: offsetTop, left: offsetLeft } = rootElement.getBoundingClientRect()
    const { width, height, top, left } = targetElement.getBoundingClientRect()

    const { width: currentWidth, height: currentHeight, top: currentTop } = dimensions ?? {}

    const getShadowTop = (): number => {
      return top + SHADOW_OFFSET - offsetTop
    }

    if (width === currentWidth && height === currentHeight && Math.abs((currentTop ?? 0) - getShadowTop()) < 5) {
      return
    }

    setDimensions({
      left: left - SHADOW_OFFSET - offsetLeft,
      top: getShadowTop(),
      width,
      height,
    })
  }, [dimensions])

  useEffect(() => {
    resizeObserver.current = new ResizeObserver(handleShadowResize)
  }, [handleShadowResize])

  useEffect(() => {
    const element = resizeProxyRef?.current ?? target.current
    const observer = resizeObserver.current

    if (!element || !observer) {
      return
    }

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  })

  // Keep shadow in sync with div transitions
  const animationFrameRef = useRef<ReturnType<typeof requestAnimationFrame>>()

  const animate = useCallback(() => {
    handleShadowResize()
    animationFrameRef.current = requestAnimationFrame(animate)
  }, [handleShadowResize])

  const handleTransitionStart = useCallback((_e: TransitionEvent) => {
    animationFrameRef.current = requestAnimationFrame(animate)
  }, [])

  const handleTransitionEnd = useCallback((_e: TransitionEvent) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = undefined
    }

    handleShadowResize()
  }, [])

  useImperativeEvent(target, 'transitionstart', handleTransitionStart)
  useImperativeEvent(target, 'transitionend', handleTransitionEnd)

  if (!dimensions) {
    return null
  }

  return (
    <div
      className="np-absolute np-rounded-md np-opacity-30 np-border-l-2 np-border-b-2 np-border-swampgreen np-bg-none"
      style={{ ...dimensions, borderBottomLeftRadius: '0.5rem' }}
    />
  )
}

export default React.memo(PseudoShadow)
