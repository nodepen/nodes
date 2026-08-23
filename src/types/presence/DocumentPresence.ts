import type { DocumentNode } from '../DocumentNode'

export type DocumentPresence = {
    // Current session's id
    sessionId: string
    sessions: {
        [sessionId: string]: {
            userId: string,
            color: string
            name: string
            // a g e n t i c
            kind: 'user' | 'agent'
            status: 'idle' | 'working' | 'thinking'
            chirp?: string
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
    wires: {
        [sessionId: string]: {
            portAnchor: {
                nodeInstanceId: string
                portInstanceId: string
            }
            targetAnchor: {
                nodeInstanceId: string
                portInstanceId: string
            } | null
        }[]
    }
    drag: {
        [nodeInstanceId: string]: {
            [sessionId: string]: {
                // The literal position on the session's document
                x: number
                y: number
                // The drag is over, clear on position change
                isFinal: boolean
            }
        }
    }
    /**
     * Nodes a session is provisionally placing, keyed by session id.
     *
     * Provisional nodes never reach the document — they get deleted if a placement is
     * abandoned — so there is nothing for an id to point back at. This channel carries whole
     * nodes rather than references, which is also why it is presence and not a document
     * update.
     */
    ghostNodes: {
        [sessionId: string]: DocumentNode[]
    }

}