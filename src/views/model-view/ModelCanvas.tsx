import React, { Suspense, useDeferredValue, useMemo } from "react"
import * as THREE from 'three'
import { Canvas, extend } from "@react-three/fiber"
import type { ThreeElement } from '@react-three/fiber'
import { OrbitControls } from "@react-three/drei"
import DocumentModel from "./components/document-model/DocumentModel"
import GridModel from "./components/grid-model/GridModel"

// @ts-expect-error This is correct actually
THREE.Object3D.DEFAULT_UP.set(0, 0, 1)

type ModelCanvasProps = {
    solutionModelUrl: string | null
}

const ModelCanvas = ({ solutionModelUrl }: ModelCanvasProps) => {
    // const fitCameraToObject = (object: THREE.Object3D) => {
    //         const box = new THREE.Box3().setFromObject(object)
    //         const center = new THREE.Vector3()
    //         const size = new THREE.Vector3()
    //         box.getCenter(center)
    //         box.getSize(size)
    //         const maxSize = Math.max(size.x, size.y, size.z)
    //         const fitDistance = Math.max(maxSize * 1.5, 1)

    //         camera.position.copy(center).add(new THREE.Vector3(fitDistance, fitDistance, fitDistance))
    //         camera.lookAt(center)
    //         camera.updateProjectionMatrix()
    //         controls.target.copy(center)
    //         controls.update()
    //     }

    return <Canvas
        className="np-w-full np-h-full"
        style={{ display: 'block' }}
        onCreated={({ camera, scene }) => {
            scene.up.set(0, 0, 1)
            camera.up.set(0, 0, 1)
            camera.lookAt(0, 0, 0)
        }}
    >
        <color attach="background" args={[0.937, 0.949, 0.949]} />
        <ambientLight intensity={0.4} />
        <GridModel />
        <Suspense fallback={null}>
            {solutionModelUrl ? <DocumentModel modelUrl={solutionModelUrl} /> : null}
        </Suspense>
        <OrbitControls />
    </Canvas>
}

export default React.memo(ModelCanvas, (prev, next) => prev.solutionModelUrl === next.solutionModelUrl)