import * as THREE from 'three'
import { tryParseUserStrings } from '@/utils/three/tryParseUserStrings'
import type { SolutionAddress, SolutionStyle, SolutionViewState } from './solutionStyle'
import { resolveSolutionStyle } from './solutionStyle'
import { getObjectKind, isStateMaterial, LINE2, POINT, type SelvaObjectKind } from './selvaMaterials'
import { MESH } from '../materials'

type Drawable = THREE.Object3D & {
    geometry?: THREE.BufferGeometry
    material?: THREE.Material | THREE.Material[]
}

type SolutionObjectData = {
    ref: SolutionAddress
    kind: SelvaObjectKind
    defaultMaterial: THREE.Material | THREE.Material[]
}

const KEY = 'nodepen'

const getData = (object: THREE.Object3D): SolutionObjectData | undefined => {
    return object.userData?.[KEY]
}

export const indexSolutionObjects = (root: THREE.Object3D): void => {
    root.traverse((object) => {
        const { material } = object as Drawable
        const kind = getObjectKind(object)

        if (!material || !kind) {
            return
        }

        const data: SolutionObjectData = {
            ref: tryParseUserStrings(object),
            kind,
            defaultMaterial: material
        }

        object.userData[KEY] = data
    })
}

export const getSolutionAddress = (object: THREE.Object3D): SolutionAddress | undefined => {
    return getData(object)?.ref
}

export const forEachSolutionObject = (root: THREE.Object3D, visit: (object: THREE.Object3D, address: SolutionAddress) => void): void => {
    root.traverse((object) => {
        const data = getData(object)

        if (data) {
            visit(object, data.ref)
        }
    })
}

const STYLE_MATERIALS: Record<Exclude<SolutionStyle, 'default' | 'hidden'>, Record<SelvaObjectKind, THREE.Material>> = {
    selected: { mesh: MESH.SELECTED, curve: LINE2.SELECTED, point: POINT.SELECTED },
    expired: { mesh: MESH.EXPIRED, curve: LINE2.EXPIRED, point: POINT.EXPIRED },
    ghosted: { mesh: MESH.GHOSTED, curve: LINE2.EXPIRED, point: POINT.EXPIRED },
}

export const applySolutionStyle = (root: THREE.Object3D, state: SolutionViewState): void => {
    root.traverse((object) => {
        const data = getData(object)

        if (!data) {
            return
        }

        const style = resolveSolutionStyle(data.ref, state)
        const drawable = object as Drawable

        object.visible = style !== 'hidden'

        drawable.material = style === 'default' || style === 'hidden'
            ? data.defaultMaterial
            : STYLE_MATERIALS[style][data.kind]
    })
}

export const disposeSolutionObjects = (root: THREE.Object3D): void => {
    const materials = new Set<THREE.Material>()

    root.traverse((object) => {
        const drawable = object as Drawable
        const data = getData(object)

        if (data) {
            drawable.material = data.defaultMaterial
        }

        drawable.geometry?.dispose()

        const material = drawable.material

        for (const m of Array.isArray(material) ? material : material ? [material] : []) {
            materials.add(m)
        }
    })

    for (const material of materials) {
        if (!isStateMaterial(material)) {
            material.dispose()
        }
    }
}
