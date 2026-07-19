import * as THREE from 'three'
import { useStore, useStoreRef } from "@/store"
import React from 'react'
import { Line } from '@react-three/drei'
import { LINE, MESH } from '../../materials'
import { tryParseUserStrings } from '@/utils/three/tryParseUserStrings'
import { useThree } from '@react-three/fiber'

type DocumentNodeModelProps = {
    id: string
    objects: THREE.Object3D<THREE.Event>[]
}

const DocumentNodeModelProps = ({ id, objects }: DocumentNodeModelProps) => {
    const node = useStore((state) => state.document.nodes[id])

    const { size } = useThree()

    const isVisible = node.status.isVisible
    const isSelected = useStore((state) => state.registry.selection.nodes.includes(id))
    const isExpired = useStore((state) => !state.solution.solutionModelUrl)

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
            const pointColor = isExpired
                ? 0xFCFCFC
                : isSelected
                    ? 0x4caf7d
                    : 0xe05a5a

            return (
                <points key={`${id}-${o.id}`} geometry={o.geometry}>
                    <pointsMaterial color={pointColor} size={7} sizeAttenuation={false} />
                </points>
            )
        }

        if (o instanceof THREE.Line) {
            const array = o.geometry.attributes.position.array
            const out: THREE.Vector3[] = []
            for (let i = 0; i < array.length; i += 3) {
                out.push(new THREE.Vector3(array[i], array[i + 1], array[i + 2]))
            }

            const material =
                isExpired
                    ? LINE.EXPIRED
                    : isHoverActive
                        ? isHovered ? LINE.SELECTED : isPortHovered ? LINE.DEFAULT : LINE.EXPIRED
                        : isSelected
                            ? LINE.SELECTED
                            : LINE.DEFAULT

            // return <Line
            //     key={`${id}-${o.id}`}
            //     points={out}
            //     lineWidth={1}
            //     transparent
            //     opacity={0.2}
            //     polygonOffset
            //     polygonOffsetFactor={-1}
            //     polygonOffsetUnits={-1}
            //     {...material}
            // />

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