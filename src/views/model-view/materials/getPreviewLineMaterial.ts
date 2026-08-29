import * as THREE from 'three'

const cache = new Map<string, THREE.LineBasicMaterial>()

/**
 * Returns a stable, cached `LineBasicMaterial` for a Custom Preview item's resolved
 * colour, matching `LINE.DEFAULT`'s shape (polygon-offset wires) but with the item's
 * own colour instead of the fixed default red.
 * @param {string} previewColor The `"R,G,B"` colour to build/retrieve a material for
 * @returns
 */
export const getPreviewLineMaterial = (previewColor: string): THREE.LineBasicMaterial => {
    const cached = cache.get(previewColor)
    if (cached) {
        return cached
    }

    const material = new THREE.LineBasicMaterial({
        color: `rgb(${previewColor})`,
        polygonOffset: true,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: -1
    })

    cache.set(previewColor, material)
    return material
}
