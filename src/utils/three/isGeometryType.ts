import type { ModelGeometryType } from "@/types/geometry";

export const isGeometryType = (o: THREE.Object3D<THREE.Event>, type: ModelGeometryType): boolean => {
    const objectType = o.userData?.objectType

    switch (type) {
        case 'Point':
        case 'Curve':
        case 'Mesh':
        case 'Extrusion':
            return objectType === type
        case 'Brep':
            return o.userData?.attributes?.geometry?.hasBrepFrom
        case 'Circle':
            return o.userData?.attributes?.geometry?.isCompleteCircle
        case 'Surface':
            return o.userData?.attributes?.geometry?.isSurface
        case 'Line':
            return !!o.userData?.attributes?.geometry?.line
        default:
            console.log(`Unknown model geometry type ${type}`)
            return false
    }
}