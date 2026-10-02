import type * as THREE from 'three'
import { parseDisplayItems, parseMeshBatchObject, type DisplayBatch, type MeshBatchParsingOptions } from '@selvajs/visualization/parse'

const batches = new Map<string, Promise<DisplayBatch>>()

export const isRhinoModelUrl = (url: string): boolean => {
    try {
        return new URL(url, 'http://localhost').pathname.toLowerCase().endsWith('.3dm')
    } catch {
        return false
    }
}

const isGzip = (bytes: Uint8Array): boolean => {
    return bytes.length > 2 && bytes[0] === 0x1f && bytes[1] === 0x8b
}

const gunzip = async (bytes: Uint8Array): Promise<Uint8Array> => {
    const stream = new Blob([bytes as BlobPart]).stream().pipeThrough(new DecompressionStream('gzip'))
    return new Uint8Array(await new Response(stream).arrayBuffer())
}

const fetchBatch = async (url: string): Promise<DisplayBatch> => {
    const response = await fetch(url)

    if (!response.ok) {
        throw new Error(`Could not load display model (${response.status}).`)
    }

    let bytes: Uint8Array = new Uint8Array(await response.arrayBuffer())

    if (isGzip(bytes)) {
        bytes = await gunzip(bytes)
    }

    return JSON.parse(new TextDecoder().decode(bytes)) as DisplayBatch
}

export const loadSelvaModel = (url: string): Promise<DisplayBatch> => {
    const cached = batches.get(url)

    if (cached) {
        return cached
    }

    const batch = fetchBatch(url)

    batches.set(url, batch)

    // Only the newest solution's batch is worth keeping
    batch.then(
        () => {
            for (const key of batches.keys()) {
                if (key !== url) {
                    batches.delete(key)
                }
            }
        },
        () => {
            batches.delete(url)
        }
    )

    return batch
}

export const buildSelvaObjects = async (
    batch: DisplayBatch,
    material?: MeshBatchParsingOptions['material']
): Promise<THREE.Object3D[]> => {
    const hasMeshes = batch.groups?.some((group) => {
        return group.meshes.length > 0
    }) ?? false

    const meshes = hasMeshes ? await parseMeshBatchObject(batch, { mergeByMaterial: false, material }) : []
    const items = parseDisplayItems(batch.items)

    return [...meshes, ...items]
}
