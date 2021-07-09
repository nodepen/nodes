/**
 * An element with directional start and end points.
 * @remarks Coordinates are in graph space.
 */
export type DirectionalElement = {
    from: [x: number, y: number]
    to: [x: number, y: number]
}