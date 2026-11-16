import type { Line, Point } from "../types";
import { getIntersection } from "./getIntersection";

// Given a line normalized to be within a unit square, return its intersection with that square
export const getSquareIntersection = (line: Line): { from: Point, to: Point } => {
    const [left, right, top, bottom] = [
        {
            x: 0,
            y: line.m * 0 + line.b
        },
        {
            x: 1,
            y: line.m * 1 + line.b
        },
        getIntersection(line, { m: 0, b: 1 }),
        getIntersection(line, { m: 0, b: 0 })
    ]

    const checks = [
        left.y >= 0 && left.y <= 1,
        right.y >= 0 && right.y <= 1,
        top.x >= 0 && top.x <= 1,
        bottom.x >= 0 && bottom.x <= 1
    ]

    const [start, end] = [left, right, top, bottom].filter((x, i) => !!checks[i])

    return {
        from: start,
        to: end
    }
}