import React from "react"
import { LINE } from "../../materials"
import * as THREE from "three"

const GridModel = () => {
    const material = LINE.GRID

    // Create 10x10 grid geometry
    const vertices: number[] = []
    const gridSize = 10
    const divisions = 10
    const step = gridSize / divisions
    const halfSize = gridSize / 2

    // Vertical lines
    for (let i = 0; i <= divisions; i++) {
        const x = -halfSize + i * step
        vertices.push(x, -halfSize, 0, x, halfSize, 0)
    }

    // Horizontal lines
    for (let i = 0; i <= divisions; i++) {
        const y = -halfSize + i * step
        vertices.push(-halfSize, y, 0, halfSize, y, 0)
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3))

    return <>
        <lineSegments geometry={geometry} material={material} renderOrder={-1} />
    </>
}

export default React.memo(GridModel)