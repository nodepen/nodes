import { GraphElement, GripElement, VisibleElement } from './types'
import { ElementDataEntry } from './ElementDataEntry'

export type ElementData = {
    'static-component': GraphElement & GripElement & VisibleElement
    'static-parameter': GraphElement & GripElement & VisibleElement
    'number-slider': GraphElement & GripElement & VisibleElement
    'panel': VisibleElement & GripElement
    'wire': Partial<VisibleElement> & { from: [x: number, y: number], to: [x: number, y: number] }
} & ElementDataEntry