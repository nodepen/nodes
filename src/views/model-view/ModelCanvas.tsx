import React, { Suspense, useRef } from "react"
import * as THREE from 'three'
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import DocumentModel from "./components/document-model/DocumentModel"
import GridModel from "./components/grid-model/GridModel"
import { useDispatch, useStore } from "@/store"
import ContextModel from "./components/context-model/ContextModel"

// @ts-expect-error This is correct actually
THREE.Object3D.DEFAULT_UP.set(0, 0, 1)

type ModelCanvasProps = {
    solutionModelUrl: string | null
}

const ModelCanvas = ({ solutionModelUrl }: ModelCanvasProps) => {
    const { clearInterface } = useDispatch()

    return <Canvas
        className="np-w-full np-h-full"
        // style={{ display: 'block' }}
        onCreated={({ camera, scene, controls }) => {
            scene.up.set(0, 0, 1)
            camera.up.set(0, 0, 1)
            camera.lookAt(0, 0, 0)
            camera.position.set(0, -4, 1)

            const fitCameraToScene = () => {
                scene.updateMatrixWorld(true)

                const bounds = new THREE.Box3()
                const tempBounds = new THREE.Box3()
                const center = new THREE.Vector3()
                const size = new THREE.Vector3()

                scene.traverse((object) => {
                    if (!object.visible) {
                        return
                    }

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

                if (bounds.isEmpty()) {
                    return
                }

                bounds.getCenter(center)
                bounds.getSize(size)

                if (!(camera instanceof THREE.PerspectiveCamera)) {
                    return
                }

                const maxDim = Math.max(size.x, size.y, size.z)
                const fitDistance = Math.max(maxDim * 1.6, 4)

                const orbitControls = controls as any
                const currentTarget = orbitControls?.target ? orbitControls.target.clone() : center.clone()
                const viewDirection = camera.position.clone().sub(currentTarget)

                if (viewDirection.lengthSq() < 1e-8) {
                    viewDirection.set(1, -1, 0.6)
                } else {
                    viewDirection.normalize()
                }

                camera.position.copy(center).add(viewDirection.multiplyScalar(fitDistance))
                camera.lookAt(center)
                camera.updateProjectionMatrix()

                if (orbitControls) {
                    orbitControls.target.copy(center)
                    orbitControls.update()
                }
            }

            useStore.getState().internalCallbacks.zoomToExtents = fitCameraToScene
        }}
        onPointerDown={() => {
            clearInterface()
        }}
    >
        {/* <color attach="background" args={[0.9333333333, 0.9490196078, 0.9490196078]} /> */}
        <ambientLight intensity={0.4} />
        <GridModel />
        <Suspense fallback={null}>
            <ContextModel />
            {solutionModelUrl ? <DocumentModel modelUrl={solutionModelUrl} /> : null}
        </Suspense>
        <OrbitControls />
    </Canvas>
}

export default React.memo(ModelCanvas, (prev, next) => prev.solutionModelUrl === next.solutionModelUrl)