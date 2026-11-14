import type { Line, Point } from "../types";

export const getLine = (a: Point, b: Point): Line => {
    const dx = b.x - a.x
    const dy = b.y - a.y

    const m = dx / dy

    return {
        m,
        b: a.y - (m * a.x)
    }
}