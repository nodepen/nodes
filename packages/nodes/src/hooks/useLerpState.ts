import { useCallback, useEffect, useRef, useState } from "react"

type SetValueOptions = {
  // If true, skip interpolation and immediately set state to value
  immediate: boolean
}

export const useLerpState = (initialValue: number, rate = 0.2): [value: number, setValue: (value: number, opts?: SetValueOptions) => void] => {
  const targetValue = useRef(initialValue)
  const [currentValue, setCurrentValue] = useState(initialValue)

  const animationFrameRef = useRef<ReturnType<typeof requestAnimationFrame>>(undefined)
  useEffect(() => {
    const lerpAll = () => {
      setCurrentValue((value) => value + ((targetValue.current - value) * rate))
      animationFrameRef.current = requestAnimationFrame(lerpAll)
    }

    lerpAll()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = undefined
      }
    }
  }, [])

  const setTargetValue = useCallback((nextTargetValue: number, options?: SetValueOptions) => {
    targetValue.current = nextTargetValue
    if (options?.immediate) {
      setCurrentValue(nextTargetValue)
    }
  }, [])

  return [currentValue, setTargetValue]
}