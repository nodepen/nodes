import { internalCallbacksRef, useDispatch, useStore } from '$'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import DocumentNodeModel from './DocumentNodeModel'
import { useLoader, useThree } from '@react-three/fiber'
import { Rhino3dmLoader } from 'three/addons/loaders/3DMLoader.js'
import { tryParseUserStrings } from '@/utils/three/tryParseUserStrings'
import { current } from 'immer'
import { useThumbnailShutter } from '../../hooks/useThumbnailShutter'

type DocumentModel = {
    modelUrl: string | null
}

const DocumentModel = ({ modelUrl }: DocumentModel) => {
    const { apply } = useDispatch()
    const { camera, scene } = useThree()

    const loader = useRef(new Rhino3dmLoader())

    const [objectsByDocumentNodeId, setObjectsByDocumentNodeId] = useState<Record<string, THREE.Object3D[]>>({})

    const offerThumbnailSubject = useThumbnailShutter(objectsByDocumentNodeId)

    // Helper function to accumulate bounds from an object hierarchy
    const accumulateBounds = (root: THREE.Object3D, bounds: THREE.Box3, tempBounds: THREE.Box3) => {
        root.traverse((object) => {
            const geometry = (object as THREE.Object3D & { geometry?: THREE.BufferGeometry }).geometry
            if (geometry) {
                if (!geometry.boundingBox) {
                    geometry.computeBoundingBox()
                }

                if (geometry.boundingBox) {
                    tempBounds.copy(geometry.boundingBox).applyMatrix4(object.matrixWorld)
                    bounds.union(tempBounds)
                }
            }
        })
    }

    useEffect(() => {
        if (!modelUrl) {
            if (useStore.getState().solution.flags.isFailed) {
                // Catastrophic failure, clear data
                setObjectsByDocumentNodeId({})
            }
            return
        }

        loader.current.setLibraryPath('https://cdn.jsdelivr.net/npm/rhino3dm@8.0.1/');
        loader.current.load(modelUrl, (documentObject) => {
            const res: Record<string, THREE.Object3D[]> = {}

            const bounds = new THREE.Box3()
            const tempBounds = new THREE.Box3()

            let objectCount = 0

            documentObject.updateMatrixWorld(true)

            documentObject.traverse((object) => {
                objectCount++
                const { nodeInstanceId } = tryParseUserStrings(object)
                if (nodeInstanceId) {
                    res[nodeInstanceId] ??= []
                    res[nodeInstanceId].push(object)
                }

                const geometry = (object as THREE.Object3D & { geometry?: THREE.BufferGeometry }).geometry
                if (geometry) {
                    if (!geometry.boundingBox) {
                        geometry.computeBoundingBox()
                    }

                    if (geometry.boundingBox) {
                        tempBounds.copy(geometry.boundingBox).applyMatrix4(object.matrixWorld)
                        bounds.union(tempBounds)
                    }
                }
            })

            apply((state) => {
                state.solution.flags.isModelExpired = false
                state.solution.messages.model = {
                    status: 'ok',
                    message: `Loaded ${objectCount} objects.`
                }

                setObjectsByDocumentNodeId(res)

                if (state.app.flags.isHomePage) {
                    const s = current(state)

                    setTimeout(() => {
                        internalCallbacksRef.zoomToExtents?.()
                        s.callbacks.onHomePageReady?.(s)
                    }, 1000);
                }

                if (state.app.flags.isThumbnail) {
                    const s = current(state)
                    const callback = s.callbacks.onThumbnailReady

                    offerThumbnailSubject('solution', bounds, () => callback?.(s))
                }
            })
        })
    }, [modelUrl, scene, camera])

    const nodeIds = useStore((state) => state.registry.documentNodeIds)

    if (!modelUrl) {
        return null
    }

    return (
        <>
            {nodeIds.map((id) => (
                <DocumentNodeModel key={`model-node-${id}`} id={id} objects={objectsByDocumentNodeId[id] ?? []} />
            ))}
        </>
    )
}

export default React.memo(DocumentModel, (prev, next) => prev.modelUrl === next.modelUrl)