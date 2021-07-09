import { GrasshopperComponent } from '../../../grasshopper/GrasshopperComponent'

export type ElementTemplate = {
    'static-component': {
        type: 'static-component'
    } & GrasshopperComponent,
    'static-parameter': {
        type: 'static-parameter'
    } & GrasshopperComponent,
    'panel': {
        type: 'panel'
    },
    'number-slider': {
        type: 'number-slider'
    },
    'wire': {
        type: 'wire'
        mode: 'data' | 'live' | 'provisional'
        from: {
            elementId: string
            parameterId: string
        }
        to: {
            elementId: string
            parameterId: string
        }
    },
    'region': {
        type: 'region'
        mode: 'group' | 'selection'
        /** The pointerId of the pointer that started region selection. */
        pointer: number
    }
}