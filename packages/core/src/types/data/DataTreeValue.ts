import type { Point3D } from './geometry'

export type DataTreeValue =
| {
    type: 'number'
    value: number
}
| {
    type: 'string'
    value: string
}
| {
    type: 'circle'
    geometry: {

    }
    boundingBox: {
        min: Point3D
        max: Point3D
    }
}
| {
    type: 'curve' | 'box' | 'surface'
}