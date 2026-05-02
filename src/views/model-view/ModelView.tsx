"use client"

import React, { Suspense } from "react"
import * as THREE from 'three'
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { Layer } from "../common"
import { useViewRegistry } from "../common/hooks"
import DocumentModel from "./components/document-model/DocumentModel"
import GridModel from "./components/grid-model/GridModel"

// @ts-expect-error This is correct actually
THREE.Object3D.DEFAULT_UP.set(0, 0, 1)

type ModelViewProps = {
    backgroundModelUrls: string[]
    contextModelUrls: string[]
    solutionModelUrl: string | null
}

const ModelView = ({ solutionModelUrl }: ModelViewProps) => {
    const [position, preciseWidth] = useViewRegistry({ key: 'model', label: 'Model' })

    const width = Math.round(preciseWidth * 1000) / 1000
    const translation = (100 - (width * 100)) / -2

    return (
        <Layer id="np-model-layer" position={position} z={10}>
            <div
                className="np-w-full np-h-full np-pointer-events-auto np-bg-pale"
                style={{ transform: `translateX(${translation}%)` }}
            >
                <Canvas
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
                    <Suspense fallback={null}>
                        <GridModel />
                        <DocumentModel modelUrl={solutionModelUrl} />
                        <OrbitControls enableDamping />
                    </Suspense>
                </Canvas>
            </div>
        </Layer>
    )
}

export default React.memo(ModelView)