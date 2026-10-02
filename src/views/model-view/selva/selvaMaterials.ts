import * as THREE from 'three'
import { LineMaterial } from 'three/addons/lines/LineMaterial.js'
import * as HEX from '../materials/colors'
import { LINE, MESH } from '../materials'

const lineMaterial = (color: number): LineMaterial => {
    const material = new LineMaterial({ color })
    material.linewidth = 2
    return material
}

export const LINE2 = {
    SELECTED: lineMaterial(HEX.GREEN),
    EXPIRED: lineMaterial(HEX.DARKGREY),
    CONTEXT: lineMaterial(HEX.DARK),
}

export const CONTEXT_LINE = {
    UNSELECTABLE: new THREE.LineBasicMaterial({ color: HEX.DARKGREY }),
}

const pointsMaterial = (color: number): THREE.PointsMaterial => {
    return new THREE.PointsMaterial({ color, size: 6, sizeAttenuation: false })
}

export const POINT = {
    SELECTED: pointsMaterial(HEX.GREEN),
    EXPIRED: pointsMaterial(HEX.GREY),
    CONTEXT: pointsMaterial(HEX.DARK),
    UNSELECTABLE: pointsMaterial(HEX.DARKGREY),
}

const STATE_MATERIALS = new Set<THREE.Material>([
    ...Object.values(LINE2),
    ...Object.values(CONTEXT_LINE),
    ...Object.values(POINT),
    ...Object.values(LINE),
    ...Object.values(MESH),
])

/** Whether a material is one of the shared state materials, which are never disposed. */
export const isStateMaterial = (material: THREE.Material): boolean => {
    return STATE_MATERIALS.has(material)
}

export type SelvaObjectKind = 'mesh' | 'curve' | 'point'

export const getObjectKind = (object: THREE.Object3D): SelvaObjectKind | null => {
    const kind = object.userData?.kind

    if (kind === 'curve' || kind === 'point') {
        return kind
    }

    if (object instanceof THREE.Points) {
        return 'point'
    }

    if (object instanceof THREE.Mesh) {
        return 'mesh'
    }

    return null
}
