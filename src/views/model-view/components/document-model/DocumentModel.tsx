import { useDispatch, useStore } from '$'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import type { OrbitControls } from '@react-three/drei'
import DocumentNodeModel from './DocumentNodeModel'
import { useLoader, useThree } from '@react-three/fiber'
import { Rhino3dmLoader } from 'three/addons/loaders/3DMLoader.js'
import { tryParseUserStrings } from '@/utils/three/tryParseUserStrings'
import { shallow } from 'zustand/shallow'
import { current } from 'immer'

type DocumentModel = {
    modelUrl: string | null
}

const DocumentModel = ({ modelUrl }: DocumentModel) => {
    const { apply } = useDispatch()
    const { camera, scene, size } = useThree()

    const loader = useRef(new Rhino3dmLoader())

    const [objectsByDocumentNodeId, setObjectsByDocumentNodeId] = useState<Record<string, THREE.Object3D[]>>({})

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

                if (state.app.flags.isThumbnail) {
                    const s = current(state)
                    const callback = s.callbacks.onThumbnailReady

                    setTimeout(() => {
                        if (!bounds.isEmpty() && camera instanceof THREE.OrthographicCamera) {
                            const center = new THREE.Vector3()
                            bounds.getCenter(center)

                            const boundingSphere = new THREE.Sphere()
                            bounds.getBoundingSphere(boundingSphere)
                            const radius = Math.max(boundingSphere.radius, 0.5)

                            const viewDirection = new THREE.Vector3(0, -1, 0.5).normalize()

                            const distance = Math.max(radius * 2, 10)

                            camera.position.copy(center).addScaledVector(viewDirection, distance)
                            camera.lookAt(center)

                            const padding = 1.3
                            const zoomForHeight = (size.height / 2) / (radius * padding)
                            const zoomForWidth = (size.width / 2) / (radius * padding)
                            camera.zoom = Math.min(zoomForHeight, zoomForWidth)
                            camera.updateProjectionMatrix()
                        }

                        callback?.(s)
                    }, 500);
                }
            })
        })
    }, [modelUrl, scene, camera])

    const nodeIds = useStore((state) => Object.keys(state.document.nodes), shallow)

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