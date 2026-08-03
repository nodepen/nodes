import { useCallback, useEffect, useRef, useState } from "react"

type Sample<T> = {
    t: number
    value: T
}

export const useInterpolatedState = <T>(
    initialValue: T,
    lerpFn: (a: T, b: T, alpha: number) => T,
    delayMs = 100
) => {
    const bufferRef = useRef<Sample<T>[]>([{ t: performance.now(), value: initialValue }])
    const [liveValue, setLiveValue] = useState(initialValue)

    const setValue = useCallback((value: T, options = { immediate: false }) => {
        const t = performance.now()

        if (options.immediate) {
            bufferRef.current = [{ t, value }]
            setLiveValue(value)
            return
        }

        const buf = bufferRef.current
        if (buf.length && t < buf[buf.length - 1].t) return // drop out-of-order
        buf.push({ t, value })

        const cutoff = performance.now() - delayMs - 250
        while (buf.length > 2 && buf[1].t < cutoff) buf.shift()
    }, [delayMs])

    useEffect(() => {
        let raf: number
        const tick = () => {
            const buf = bufferRef.current
            const renderTime = performance.now() - delayMs

            let i = buf.length - 1
            while (i > 0 && buf[i - 1].t > renderTime) i--

            const b = buf[i]
            const a = buf[i - 1]

            const next =
                !a || renderTime >= b.t
                    ? b.value
                    : lerpFn(a.value, b.value, (renderTime - a.t) / (b.t - a.t))

            setLiveValue(next)
            raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(raf)
    }, [delayMs, lerpFn])

    return [liveValue, setValue] as const
}

type Point2d = {
    x: number
    y: number
}

export const lerpNumber = (a: number, b: number, alpha: number): number => {
    return a + (b - a) * alpha
}

export const lerpPoint2d = (a: Point2d, b: Point2d, alpha: number): Point2d => {
    return {
        x: a.x + (b.x - a.x) * alpha,
        y: a.y + (b.y - a.y) * alpha
    }
}