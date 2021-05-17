import { GraphElement, VisibleElement } from './types'
import { ElementDataEntry } from './ElementDataEntry'

export type ElementData = {
    'static-component': GraphElement & VisibleElement
    'static-parameter': GraphElement & VisibleElement
    'number-slider': GraphElement & VisibleElement
    'panel': VisibleElement
    'wire': VisibleElement
} & ElementDataEntry