import React, { Suspense, useDeferredValue, useMemo } from "react"
import * as THREE from 'three'
import { Canvas, extend } from "@react-three/fiber"
import type { ThreeElement } from '@react-three/fiber'
import { OrbitControls } from "@react-three/drei"
import DocumentModel from "./components/document-model/DocumentModel"
import GridModel from "./components/grid-model/GridModel"
import { useDispatch } from "@/store"

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
        onCreated={({ camera, scene }) => {
            scene.up.set(0, 0, 1)
            camera.up.set(0, 0, 1)
            camera.lookAt(0, 0, 0)
            camera.position.set(0, -4, 1)
        }}
        onPointerDown={() => {
            clearInterface()
        }}
    >
        {/* <color attach="background" args={[0.9333333333, 0.9490196078, 0.9490196078]} /> */}
        <ambientLight intensity={0.4} />
        <GridModel />
        <Suspense fallback={null}>
            {solutionModelUrl ? <DocumentModel modelUrl={solutionModelUrl} /> : null}
        </Suspense>
        <OrbitControls />
    </Canvas>
}

export default React.memo(ModelCanvas, (prev, next) => prev.solutionModelUrl === next.solutionModelUrl)