import type * as Speckle from '@speckle/viewer'

declare global {
    export class InteractionHandler {
        rotateTo(side: string, transition?: boolean): [any]
    }
}