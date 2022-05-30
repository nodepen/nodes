export type Element = {
    id: string
    /* ID of  */
    template: string
    /* Current top-left coordinate of element in world space. */
    position: {
        x: number
        y: number
    }
    /* Current width and height of element in world dimensions. */
    dimensions: {
        width: number
        height: number
    }
}