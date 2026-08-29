import * as THREE from 'three'

const cache = new Map<string, THREE.MeshStandardMaterial>()

/**
 * Returns a stable, cached `MeshStandardMaterial` for a Custom Preview item's resolved
 * colour, matching `MESH.DEFAULT`'s shape (translucent, double-sided) but with the
 * item's own colour instead of the fixed default red.
 * @param {string} previewColor The `"R,G,B"` colour to build/retrieve a material for
 * @returns
 */
export const getPreviewMeshMaterial = (previewColor: string): THREE.MeshStandardMaterial => {
    const cached = cache.get(previewColor)
    if (cached) {
        return cached
    }

    const material = new THREE.MeshStandardMaterial({
        color: `rgb(${previewColor})`,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6
    })

    cache.set(previewColor, material)
    return material
}
