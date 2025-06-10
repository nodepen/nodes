import { useCallback, useEffect, useRef, useState } from "react"

export const useLerpState = (initialValue: number, rate = 0.2): [value: number, setValue: (value: number) => void] => {
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

  const setTargetValue = useCallback((nextTargetValue: number) => {
    targetValue.current = nextTargetValue
  }, [])

  return [currentValue, setTargetValue]
}