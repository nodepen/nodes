export type DocumentNode = {
    id: string
    /* ID of  */
    template: string
    /* Current top-left coordinate of node in world space. */
    position: {
        x: number
        y: number
    }
    /* Current width and height of node in world dimensions. */
    dimensions: {
        width: number
        height: number
    }
}