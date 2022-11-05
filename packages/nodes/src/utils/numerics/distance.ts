/**
 * Given two points in 2D space, return the linear distance between them.
 */
export const distance = (a: [x: number, y: number], b: [x: number, y: number]): number => {
    const [ax, ay] = a
    const [bx, by] = b

    return Math.sqrt(Math.pow(bx - ax, 2) + Math.pow(by - ay, 2))
}