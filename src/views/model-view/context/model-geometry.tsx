"use client"

import type * as THREE from 'three'
import { createContext, useContext, useMemo, useState } from 'react'
import type { PropsWithChildren } from 'react'
import { useLoader } from '@react-three/fiber'
import { Rhino3dmLoader } from 'three/examples/jsm/loaders/3DMLoader'
import { tryParseUserStrings } from '@/utils/three/tryParseUserStrings'

type ModelGeometryContextValue = {
    documentObject: THREE.Object3D
    objectsByDocumentNodeId: Record<string, THREE.Object3D[]>
}

const ModelGeometryContext = createContext<ModelGeometryContextValue | null>(null)

type Props = PropsWithChildren<{
    modelUrl: string | null
}>

export const ModelGeometryProvider = ({
    modelUrl,
    children
}: Props) => {
    const documentObject = useLoader(Rhino3dmLoader, modelUrl ?? '', (loader) => {
        loader.setLibraryPath('https://cdn.jsdelivr.net/npm/rhino3dm@8.0.1/')
    })

    const objectsByDocumentNodeId = useMemo(() => {
        const res: Record<string, THREE.Object3D[]> = {}

        documentObject.traverse((object) => {
            const { nodeInstanceId } = tryParseUserStrings(object)
            if (nodeInstanceId) {
                res[nodeInstanceId] ??= []
                res[nodeInstanceId].push(object)
            }
        })

        return res
    }, [documentObject])

    return (
        <ModelGeometryContext.Provider value={{ documentObject, objectsByDocumentNodeId }}>
            {children}
        </ModelGeometryContext.Provider>
    )
}

export const useModelGeometry = () => {
    const context = useContext(ModelGeometryContext)
    if (!context) throw new Error('No model in context tree!')
    return context
}