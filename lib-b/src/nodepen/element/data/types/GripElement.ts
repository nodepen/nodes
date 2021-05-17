/**
 * An element with notable snap-to coordinates.
 * @remarks Coordinates are in graph space.
 * */
export type GripElement = {
    anchors: {
        [id: string]: [number, number]
    }
}