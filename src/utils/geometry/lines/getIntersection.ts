import type { Line, Point } from "../types";

export const getIntersection = (a: Line, b: Line): Point => {
    const x = (b.b - a.b) / (a.m - b.m)
    const y = (a.m * x) + a.b

    return { x, y }
}