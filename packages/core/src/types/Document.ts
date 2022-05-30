import type { Element } from './Element'

export type Document = {
    id: string
    elements: { [elementId: string]: Element }
    library: { [templateId: string]: unknown }
    version: 1
}