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
    boundingBox: {
        min: GH.Point
        max: GH.Point
    }
}
| {
    type: 'curve' | 'box' | 'surface'
}