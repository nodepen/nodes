import * as THREE from 'three'
import { Rhino3dmLoader } from 'three/addons/loaders/3DMLoader.js'
import type { ModelGeometryType } from '@/types/geometry'
import { isGeometryType } from '@/utils/three/isGeometryType'
import { registerModelObjects, unregisterModel } from '@/utils/three/referenceIndex'
import { LINE, MESH } from '../materials'
import { CONTEXT_LINE, isStateMaterial, POINT } from './selvaMaterials'

const RHINO3DM_LIBRARY_PATH = 'https://cdn.jsdelivr.net/npm/rhino3dm@8.0.1/'

const downloads = new Map<string, Promise<ArrayBuffer>>()

const download = (url: string): Promise<ArrayBuffer> => {
    const cached = downloads.get(url)

    if (cached) {
        return cached
    }

    const pending = fetch(url).then((response) => {
        if (!response.ok) {
            throw new Error(`Could not load reference model (${response.status}).`)
        }

        return response.arrayBuffer()
    })

    downloads.set(url, pending)

    // A failure is forgotten, so a retry downloads again.
    pending.catch(() => {
        downloads.delete(url)
    })

    return pending
}

type Drawable = THREE.Object3D & {
    geometry?: THREE.BufferGeometry
    material?: THREE.Material | THREE.Material[]
}

const MODEL_KEY = 'nodepenModelKey'
const LOADED_MATERIAL = 'nodepenLoadedMaterial'

/** The attachment key of the reference model an object belongs to, if it belongs to one. */
export const getModelKey = (object: THREE.Object3D): string | null => {
    let current: THREE.Object3D | null = object

    while (current) {
        const key = current.userData?.[MODEL_KEY]

        if (typeof key === 'string') {
            return key
        }

        current = current.parent
    }

    return null
}

export const loadReferenceModel = async (loader: Rhino3dmLoader, modelKey: string, url: string): Promise<THREE.Object3D> => {
    const buffer = await download(url)

    const root = await new Promise<THREE.Object3D>((resolve, reject) => {
        loader.parse(buffer.slice(0), resolve, reject)
    })

    root.userData[MODEL_KEY] = modelKey
    root.updateMatrixWorld(true)

    const byGuid = new Map<string, THREE.Object3D>()

    root.traverse((object) => {
        const drawable = object as Drawable

        if (drawable.material) {
            object.userData[LOADED_MATERIAL] = drawable.material
        }

        if (object instanceof THREE.Mesh) {
            object.geometry.computeVertexNormals()
            object.geometry.computeBoundingSphere()
        }

        const guid = object.userData?.attributes?.id

        if (typeof guid === 'string') {
            byGuid.set(guid, object)
        }
    })

    registerModelObjects(modelKey, byGuid)

    return root
}

export const createReferenceModelLoader = (): Rhino3dmLoader => {
    const loader = new Rhino3dmLoader()
    loader.setLibraryPath(RHINO3DM_LIBRARY_PATH)
    return loader
}

/** Removes a loaded reference model and frees what it holds, keeping the shared state materials. */
export const disposeReferenceModel = (root: THREE.Object3D): void => {
    const modelKey = root.userData?.[MODEL_KEY]
    const materials = new Set<THREE.Material>()

    root.traverse((object) => {
        const drawable = object as Drawable
        drawable.geometry?.dispose()

        const loaded = object.userData?.[LOADED_MATERIAL] as THREE.Material | THREE.Material[] | undefined

        for (const m of Array.isArray(loaded) ? loaded : loaded ? [loaded] : []) {
            materials.add(m)
        }
    })

    for (const material of materials) {
        if (!isStateMaterial(material)) {
            material.dispose()
        }
    }

    root.removeFromParent()

    if (typeof modelKey === 'string') {
        unregisterModel(modelKey)
    }
}

export type ContextStyleState =
    | { mode: 'default', selection: Record<string, string[]> }
    | { mode: 'select', selection: Record<string, string[]>, selectionFilter: ModelGeometryType[] }

/** Whether an object can be picked right now: anything outside pick mode, or a match for its filter. */
export const isSelectable = (object: THREE.Object3D, state: ContextStyleState): boolean => {
    return state.mode === 'default' || state.selectionFilter.some((type) => {
        return isGeometryType(object, type)
    })
}

export const applyContextStyle = (root: THREE.Object3D, state: ContextStyleState): void => {
    root.traverse((object) => {
        const modelKey = getModelKey(object)
        const guid = object.userData?.attributes?.id

        const isSelected = !!modelKey && typeof guid === 'string' && !!state.selection[modelKey]?.includes(guid)
        const selectable = isSelectable(object, state)

        if (object instanceof THREE.Points) {
            object.material = isSelected ? POINT.SELECTED : selectable ? POINT.CONTEXT : POINT.UNSELECTABLE
        } else if (object instanceof THREE.Line) {
            object.material = isSelected ? LINE.SELECTED : selectable ? LINE.CONTEXT : CONTEXT_LINE.UNSELECTABLE
        } else if (object instanceof THREE.Mesh) {
            object.material = isSelected ? MESH.SELECTED : selectable ? MESH.CONTEXT : MESH.EXPIRED
        }
    })
}
