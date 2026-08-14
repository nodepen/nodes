import { useDispatch, useStore } from '$'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import type { OrbitControls } from '@react-three/drei'
import DocumentNodeModel from './DocumentNodeModel'
import { useLoader, useThree } from '@react-three/fiber'
import { Rhino3dmLoader } from 'three/addons/loaders/3DMLoader.js'
import { tryParseUserStrings } from '@/utils/three/tryParseUserStrings'
import { shallow } from 'zustand/shallow'

type DocumentModel = {
    modelUrl: string | null
}

const DocumentModel = ({ modelUrl }: DocumentModel) => {
    const { apply } = useDispatch()
    const { camera, scene } = useThree()

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

            // First accumulate bounds from existing scene geometry
            // accumulateBounds(scene, bounds, tempBounds)

            // Then accumulate bounds from the new model
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

            // if (!bounds.isEmpty() && camera instanceof THREE.PerspectiveCamera) {
            //     const sphere = new THREE.Sphere()
            //     bounds.getBoundingSphere(sphere)

            //     const distance = camera.position.distanceTo(sphere.center)

            //     camera.near = Math.max(0.01, distance - sphere.radius * 2)
            //     camera.far = Math.max(distance + sphere.radius * 4, sphere.radius * 10)
            //     camera.updateProjectionMatrix()
            // }

            apply((state) => {
                state.solution.flags.isModelExpired = false
                state.solution.messages.model = {
                    status: 'ok',
                    message: `Loaded ${objectCount} objects.`
                }

                setObjectsByDocumentNodeId(res)

                if (state.app.flags.isThumbnail) {
                    setTimeout(() => {
                        scene.updateMatrixWorld(true)

                        const bounds = new THREE.Box3()
                        const tempBounds = new THREE.Box3()
                        const center = new THREE.Vector3()
                        const size = new THREE.Vector3()

                        scene.traverse((object) => {
                            const geometry = (object as THREE.Object3D & { geometry?: THREE.BufferGeometry }).geometry
                            if (!geometry) {
                                return
                            }

                            if (!geometry.boundingBox) {
                                geometry.computeBoundingBox()
                            }

                            if (geometry.boundingBox) {
                                tempBounds.copy(geometry.boundingBox).applyMatrix4(object.matrixWorld)
                                bounds.union(tempBounds)
                            }
                        })

                        if (!bounds.isEmpty()) {
                            bounds.getCenter(center)
                            bounds.getSize(size)

                            const maxDim = Math.max(size.x, size.y, size.z, 1)
                            const distance = Math.max(maxDim * 1.8, 4)
                            const neutralOffset = new THREE.Vector3(-distance, -distance, distance * 0.9)

                            camera.position.copy(center).add(neutralOffset)
                            camera.lookAt(center)
                            camera.updateProjectionMatrix()
                        }

                        state.callbacks.onThumbnailReady?.(state)
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