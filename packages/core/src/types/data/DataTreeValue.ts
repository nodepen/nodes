import type * as GH from './geometry'

export type DataTreeValue =
| {
    type: 'boolean'
    value: boolean
}
| {
    type: 'integer' | 'number'
    value: number
}
| {
    type: 'string'
    value: string
}
| {
    type: 'circle'
    value: {
        center: GH.Point
        circumference: number
        diameter: number
        plane: GH.Plane
        radius: number
    }
}
| {
    type: 'curve' | 'box' | 'surface'
    value: string
}