import { useDispatch, useStore } from '$'
import React, { useCallback, useEffect, useMemo } from 'react'
import * as THREE from 'three'
import type { OrbitControls } from '@react-three/drei'
import DocumentNodeModel from './DocumentNodeModel'
import { useLoader, useThree } from '@react-three/fiber'
import { Rhino3dmLoader } from 'three/examples/jsm/loaders/3DMLoader'
import { tryParseUserStrings } from '@/utils/three/tryParseUserStrings'
import { shallow } from 'zustand/shallow'

type DocumentModel = {
    modelUrl: string
}

const DocumentModel = ({ modelUrl }: DocumentModel) => {
    const { apply } = useDispatch()

    const documentObject = useLoader(Rhino3dmLoader, modelUrl, (loader) => {
        loader.setLibraryPath('https://cdn.jsdelivr.net/npm/rhino3dm@8.0.1/')
    })

    useEffect(() => {
        apply((state) => {
            if (!documentObject) {
                return
            }

            state.solution = {
                ...state.solution,
                isExpired: false,
                solutionStatusMessages: [
                    {
                        status: 'ok',
                        message: `Solved ${Object.keys(state.document.nodes).length} nodes.`
                    },
                    {
                        status: 'ok',
                        message: 'Loaded geometry.'
                    }
                ]
            }
        })
    }, [documentObject])

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

    // Dispose of geometry when new model laoded
    useEffect(() => {
        return () => {
            if (documentObject) {
                documentObject.traverse((obj) => {
                    if (obj instanceof THREE.Mesh) {
                        obj.geometry?.dispose()
                        if (Array.isArray(obj.material)) {
                            obj.material.forEach(m => m.dispose())
                        } else {
                            obj.material?.dispose()
                        }
                    }
                })
            }
            if (modelUrl) {
                useLoader.clear(Rhino3dmLoader, modelUrl)
            }
        }
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