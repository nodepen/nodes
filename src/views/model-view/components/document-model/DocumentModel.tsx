import { useDispatch, useStore } from '$'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import type { OrbitControls } from '@react-three/drei'
import DocumentNodeModel from './DocumentNodeModel'
import { useLoader, useThree } from '@react-three/fiber'
import { Rhino3dmLoader } from 'three/examples/jsm/loaders/3DMLoader'
import { tryParseUserStrings } from '@/utils/three/tryParseUserStrings'
import { shallow } from 'zustand/shallow'

type DocumentModel = {
    modelUrl: string | null
}

const DocumentModel = ({ modelUrl }: DocumentModel) => {
    const { apply } = useDispatch()

    const loader = useRef(new Rhino3dmLoader())

    const [objectsByDocumentNodeId, setObjectsByDocumentNodeId] = useState<Record<string, THREE.Object3D[]>>({})

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

            let objectCount = 0

            documentObject.traverse((object) => {
                objectCount++
                const { nodeInstanceId } = tryParseUserStrings(object)
                if (nodeInstanceId) {
                    res[nodeInstanceId] ??= []
                    res[nodeInstanceId].push(object)
                }
            })

            apply((state) => {
                state.solution.flags.isModelExpired = false
                state.solution.messages.model = {
                    status: 'ok',
                    message: `Loaded ${objectCount} objects.`
                }

                setObjectsByDocumentNodeId(res)
            })

        })
    }, [modelUrl])

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