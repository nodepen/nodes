/**
 * An element with notable snap-to coordinates.
 * @remarks Coordinates are in graph space and are offsets from parent element position.
 * */
export type GripElement = {
    anchors: {
        [id: string]: [dx: number, dx: number]
    }
}