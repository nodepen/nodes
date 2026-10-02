import { useCallback, useEffect, useRef, useState } from "react"

type SetValueOptions = {
  // If true, skip interpolation and immediately set state to value
  immediate: boolean
}

export const useLerpState = (initialValue: number, rate = 0.2): [value: number, setValue: (value: number, opts?: SetValueOptions) => void] => {
  const targetValueRef = useRef(initialValue)
  const currentValueRef = useRef(initialValue)
  const [currentValue, setCurrentValue] = useState(initialValue)
  const animationFrameRef = useRef<number | null>(null)

  const cancelFrame = useCallback(() => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
  }, [])

  const animate = useCallback(() => {
    const current = currentValueRef.current
    const target = targetValueRef.current

    if (current === target) {
      animationFrameRef.current = null
      return
    }

    const nextValue = current + (target - current) * rate
    const epsilon = Math.max(1e-6, Math.abs(target) * 1e-6)
    const interpolatedValue = Math.abs(target - nextValue) <= epsilon ? target : nextValue

    if (interpolatedValue === current) {
      animationFrameRef.current = null
      return
    }

    currentValueRef.current = interpolatedValue
    setCurrentValue(interpolatedValue)

    if (interpolatedValue === target) {
      animationFrameRef.current = null
      return
    }

    animationFrameRef.current = requestAnimationFrame(animate)
  }, [rate])

  useEffect(() => {
    return () => {
      cancelFrame()
    }
  }, [cancelFrame])

  const setTargetValue = useCallback(
    (nextTargetValue: number, options?: SetValueOptions) => {
      if (nextTargetValue === targetValueRef.current && !options?.immediate) {
        return
      }

      targetValueRef.current = nextTargetValue

      if (options?.immediate) {
        cancelFrame()
        currentValueRef.current = nextTargetValue
        setCurrentValue(nextTargetValue)
        return
      }

      if (animationFrameRef.current === null) {
        animationFrameRef.current = requestAnimationFrame(animate)
      }
    },
    [animate, cancelFrame]
  )

  return [currentValue, setTargetValue]
}
