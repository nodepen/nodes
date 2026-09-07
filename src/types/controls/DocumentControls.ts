
export type DocumentControls = {
    input: {
        [id: string]: DocumentControl
    }
    output: {
        [id: string]: DocumentControl
    }
}

export type DocumentControl = {
    order: number
    description?: string
    ref: {
        nodeInstanceId: string
        portInstanceId: string
    }
}
