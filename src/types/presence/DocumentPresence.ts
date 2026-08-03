
export type DocumentPresence = {
    // Current session's id
    sessionId: string
    sessions: {
        [sessionId: string]: {
            userId: string,
            color: string
            name: string
        }
    }
    cursors: {
        [sessionId: string]: {
            x: number
            y: number
        } | null
    }
    cameras: {
        [sessionId: string]: {
            x: number
            y: number
            zoom: number
        }
    }
    selection: {
        [sessionId: string]: string[]
    }
    selectionRegions: {
        [sessionId: string]: {
            from: {
                x: number
                y: number
            }
            to: {
                x: number
                y: number
            }
        } | null
    }

}