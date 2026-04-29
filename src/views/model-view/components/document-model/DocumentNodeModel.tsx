import * as THREE from 'three'
import { useStore } from "@/store"
import { useModelGeometry } from "../../context/model-geometry"
import React from 'react'

type DocumentNodeModelProps = {
    id: string
}

const DocumentNodeModelProps = ({ id }: DocumentNodeModelProps) => {
    const node = useStore((state) => state.document.nodes[id])

    const { objectsByDocumentNodeId } = useModelGeometry()
    const objects = objectsByDocumentNodeId[id] ?? []

    const isVisible = node.status.isVisible

    // Meshes and stuff here
    return objects.map((o) => {
        if (o instanceof THREE.Points) {
            return <></>
        }

        if (o instanceof THREE.Line) {
            return <></>
        }

        if (o instanceof THREE.Mesh) {
            return <></>
        }

        return null
    })
}

export default React.memo(DocumentNodeModelProps)