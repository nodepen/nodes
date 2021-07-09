import { DirectionalElement, GraphElement, GripElement, SelectionElement, VisibleElement } from './types'
import { ElementDataEntry } from './ElementDataEntry'

export type ElementData = {
    'static-component': GraphElement & GripElement & VisibleElement
    'static-parameter': GraphElement & GripElement & VisibleElement
    'number-slider': GraphElement & GripElement & VisibleElement
    'panel': VisibleElement & GripElement
    'wire': VisibleElement & DirectionalElement
    'region': VisibleElement & DirectionalElement & SelectionElement
} & ElementDataEntry