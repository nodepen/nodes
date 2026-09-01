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
    const rafRef = useRef<number | null>(null)

    // Make sure loop stops when idle. `setValue` kicks things back off when needed
    const tick = useCallback(() => {
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

        const settled = i === buf.length - 1 && renderTime >= b.t

        if (settled) {
            rafRef.current = null
            return
        }

        rafRef.current = requestAnimationFrame(tick)
    }, [delayMs, lerpFn])

    const setValue = useCallback((value: T, options = { immediate: false }) => {
        const t = performance.now()

        if (options.immediate) {
            bufferRef.current = [{ t, value }]
            setLiveValue(value)
        } else {
            const buf = bufferRef.current
            if (buf.length && t < buf[buf.length - 1].t) {
                // drop out-of-order sample
            } else {
                buf.push({ t, value })

                const cutoff = performance.now() - delayMs - 250
                while (buf.length > 2 && buf[1].t < cutoff) buf.shift()
            }
        }

        if (rafRef.current === null) {
            rafRef.current = requestAnimationFrame(tick)
        }
    }, [delayMs, tick])

    useEffect(() => {
        rafRef.current = requestAnimationFrame(tick)
        return () => {
            if (rafRef.current !== null) {
                cancelAnimationFrame(rafRef.current)
                rafRef.current = null
            }
        }
    }, [tick])

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