import { useStore } from '$'
import React, { useMemo } from 'react'
import DocumentNodeModel from './DocumentNodeModel'
import { useLoader } from '@react-three/fiber'
import { Rhino3dmLoader } from 'three/examples/jsm/loaders/3DMLoader'
import { tryParseUserStrings } from '@/utils/three/tryParseUserStrings'

type DocumentModel = {
    modelUrl: string | null
}

const DocumentModel = ({ modelUrl }: DocumentModel) => {
    const documentObject = useLoader(Rhino3dmLoader, modelUrl ?? '', (loader) => {
        loader.setLibraryPath('https://cdn.jsdelivr.net/npm/rhino3dm@8.0.1/')
    })

    const objectsByDocumentNodeId = useMemo(() => {
        const res: Record<string, THREE.Object3D[]> = {}

        console.log(modelUrl)

        documentObject.traverse((object) => {
            const { nodeInstanceId } = tryParseUserStrings(object)
            if (nodeInstanceId) {
                res[nodeInstanceId] ??= []
                res[nodeInstanceId].push(object)
            }
        })

        return res
    }, [documentObject])

    const nodeIds = useStore((state) => Object.keys(state.document.nodes))

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