
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

}