import * as THREE from 'three'
import { useStore, useStoreRef } from "@/store"
import React from 'react'
import { LINE, MESH } from '../../materials'
import { tryParseUserStrings } from '@/utils/three/tryParseUserStrings'

type DocumentNodeModelProps = {
    id: string
    objects: THREE.Object3D<THREE.Event>[]
}

const DocumentNodeModelProps = ({ id, objects }: DocumentNodeModelProps) => {
    const node = useStore((state) => state.document.nodes[id])

    const isVisible = node.status.isVisible
    const isSelected = useStore((state) => state.registry.selection.nodes.includes(id))
    const isExpired = useStore((state) => state.solution.isExpired)

    const currentHover = useStore((state) => state.registry.hover)

    const isHoverActive = !!currentHover.branch

    if (!isVisible) {
        return null
    }

    // Meshes and stuff here
    return objects.map((o) => {
        const { nodeInstanceId, portInstanceId, branchPath, branchEntryIndex } = tryParseUserStrings(o)

        const isHovered = isHoverActive
            && nodeInstanceId === currentHover.nodeInstanceId
            && portInstanceId === currentHover.portInstanceId
            && branchPath === currentHover.branch?.path
            && branchEntryIndex === currentHover.branch?.entryIndex

        const isPortHovered = isHoverActive
            && nodeInstanceId === currentHover.nodeInstanceId
            && portInstanceId === currentHover.portInstanceId

        if (o instanceof THREE.Points) {
            return <></>
        }

        if (o instanceof THREE.Line) {
            if (isHoverActive && !isPortHovered) {
                return null
            }

            const material =
                isExpired
                    ? LINE.EXPIRED
                    : isHoverActive
                        ? isHovered ? LINE.SELECTED : isPortHovered ? LINE.DEFAULT : LINE.EXPIRED
                        : isSelected
                            ? LINE.SELECTED
                            : LINE.DEFAULT
            // @ts-expect-error react-three-fibre line vs svg line
            return <line key={`${id}-${o.id}`} geometry={o.geometry} material={material} />
        }

        if (o instanceof THREE.Mesh) {
            const material =
                isExpired
                    ? MESH.EXPIRED
                    : isHoverActive
                        ? isHovered ? MESH.SELECTED : isPortHovered ? MESH.DEFAULT : MESH.GHOSTED
                        : isSelected
                            ? MESH.SELECTED
                            : MESH.DEFAULT
            return <mesh key={`${id}-${o.id}`} geometry={o.geometry} material={material} />
        }

        return null
    })
}

export default React.memo(DocumentNodeModelProps)