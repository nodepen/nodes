import type * as THREE from 'three'
import type * as NodePen from '@/types'

/** model key => object guid => threejs object */
const objectsByModel = new Map<string, Map<string, THREE.Object3D>>()

export const registerModelObjects = (modelKey: string, byGuid: Map<string, THREE.Object3D>): void => {
    objectsByModel.set(modelKey, byGuid)
}

export const unregisterModel = (modelKey: string): void => {
    objectsByModel.delete(modelKey)
}

export const getLoadedModelKeys = (): string[] => [...objectsByModel.keys()]

export const resolveReferenceObject = (reference: {
    sourceFileKey: string
    sourceFileGuid: string
}): THREE.Object3D | null => {
    return objectsByModel.get(reference.sourceFileKey)?.get(reference.sourceFileGuid) ?? null
}

export const findModelKeyForObject = (object: THREE.Object3D): string | null => {
    const guid = object.userData?.attributes?.id

    if (typeof guid !== 'string') {
        return null
    }

    for (const [modelKey, byGuid] of objectsByModel) {
        if (byGuid.get(guid) === object) {
            return modelKey
        }
    }

    return null
}

export const isReferenceValue = (
    value: NodePen.DataTreeValue
): value is Extract<NodePen.DataTreeValue, { type: 'reference' }> =>
    value.type === 'reference' && 'sourceFileKey' in value
