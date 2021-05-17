/** An element that occupies a visible portion of the graph. */
export type VisibleElement = {
    position: [number, number]
    dimensions: {
        width: number
        height: number
    }
}