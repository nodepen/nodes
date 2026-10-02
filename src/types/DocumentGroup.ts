
export type DocumentGroup = {
    label?: string
    description?: string
    color: string // Hex
    items: {
        // Instance id of contained nodes
        nodes: string[]
    }

}
