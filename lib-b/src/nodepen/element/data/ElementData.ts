import { DataTreeElement, VisibleElement } from './types'
import { ElementDataEntry } from './ElementDataEntry'

export type ElementData = {
    'static-component': DataTreeElement & VisibleElement
    'static-parameter': DataTreeElement & VisibleElement
    'number-slider': DataTreeElement & VisibleElement
    'panel': VisibleElement
    'wire': VisibleElement
} & ElementDataEntry