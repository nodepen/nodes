
export type DocumentPresence = {
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
        }
    }
    cameras: {
        [sessionId: string]: {
            x: number
            y: number
            zoom: number
        }
    }
}