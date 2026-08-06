
export type DocumentControls = {
    input: DocumentControl[]
    output: DocumentControl[]
}

export type DocumentControl = {
    order: number
    description?: string
    ref: {
        nodeInstanceId: string
        portInstanceId: string
    }
}