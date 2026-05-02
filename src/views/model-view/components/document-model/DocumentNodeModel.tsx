import * as THREE from 'three'
import { useStore } from "@/store"
import React from 'react'
import { LINE, MESH } from '../../materials'

type DocumentNodeModelProps = {
    id: string
    objects: THREE.Object3D<THREE.Event>[]
}

const DocumentNodeModelProps = ({ id, objects }: DocumentNodeModelProps) => {
    const node = useStore((state) => state.document.nodes[id])

    const isVisible = node.status.isVisible
    const isSelected = useStore((state) => state.registry.selection.nodes.includes(id))

    if (!isVisible) {
        return null
    }

    // Meshes and stuff here
    return objects.map((o) => {
        if (o instanceof THREE.Points) {
            return <></>
        }

        if (o instanceof THREE.Line) {
            const material = isSelected ? LINE.SELECTED : LINE.DEFAULT
            // @ts-expect-error react-three-fibre line vs svg line
            return <line key={`${id}-${o.id}`} geometry={o.geometry} material={material} />
        }

        if (o instanceof THREE.Mesh) {
            const material = isSelected ? MESH.SELECTED : MESH.DEFAULT
            return <mesh key={`${id}-${o.id}`} geometry={o.geometry} material={material} />
        }

        return null
    })
}

export default React.memo(DocumentNodeModelProps)