import * as THREE from 'three'
import { pickThreshold, pointerToNdc, type ThreeViewer } from '@selvajs/visualization/render'

const LINE2_PICK_PX = 6

/** Fallback pick size (in css px) for points whose material size is not in screen pixels. */
const POINT_PICK_PX = 6

const isShown = (object: THREE.Object3D): boolean => {
    let current: THREE.Object3D | null = object

    while (current) {
        if (!current.visible) {
            return false
        }

        current = current.parent
    }

    return true
}

const getPointMaterial = (points: THREE.Points): THREE.Material => {
    return Array.isArray(points.material) ? points.material[0] : points.material
}

/** Half the drawn width of a point, in css px. `PointsMaterial.size` is already css px when not attenuated. */
const getPointHalfSize = (material: THREE.Material): number => {
    if (material instanceof THREE.PointsMaterial && !material.sizeAttenuation) {
        return material.size / 2
    }

    return POINT_PICK_PX / 2
}

const pickPoint = (
    camera: THREE.Camera,
    ray: THREE.Ray,
    ndc: { x: number, y: number },
    canvas: HTMLCanvasElement,
    roots: THREE.Object3D[],
    accept: (object: THREE.Object3D) => boolean
): THREE.Intersection | null => {
    const { width, height } = canvas.getBoundingClientRect()
    const world = new THREE.Vector3()
    const projected = new THREE.Vector3()

    let best: THREE.Intersection | null = null
    let bestScreenDistance = Infinity

    for (const root of roots) {
        root.traverse((object) => {
            if (!(object instanceof THREE.Points) || !isShown(object) || !accept(object)) {
                return
            }

            const position = object.geometry.getAttribute('position')

            if (!position) {
                return
            }

            const halfSize = getPointHalfSize(getPointMaterial(object))
            const { start, count } = object.geometry.drawRange
            const end = Math.min(position.count, start + count)

            for (let i = start; i < end; i++) {
                world.fromBufferAttribute(position, i).applyMatrix4(object.matrixWorld)
                projected.copy(world).project(camera)

                if (projected.z < -1 || projected.z > 1) {
                    continue
                }

                const dx = Math.abs(projected.x - ndc.x) * width / 2
                const dy = Math.abs(projected.y - ndc.y) * height / 2

                if (dx > halfSize || dy > halfSize) {
                    continue
                }

                const screenDistance = Math.hypot(dx, dy)
                const distance = ray.origin.distanceTo(world)

                if (screenDistance > bestScreenDistance || (screenDistance === bestScreenDistance && best && distance >= best.distance)) {
                    continue
                }

                bestScreenDistance = screenDistance
                best = { distance, point: world.clone(), index: i, object }
            }
        })
    }

    return best
}

export const pickNearest = (
    viewer: ThreeViewer,
    event: MouseEvent,
    roots: THREE.Object3D[],
    accept: (object: THREE.Object3D) => boolean
): THREE.Intersection | null => {
    const camera = viewer.cameraController.getActiveCamera()
    const canvas = viewer.renderer.domElement
    const ndc = pointerToNdc(event, canvas)

    const raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(new THREE.Vector2(ndc.x, ndc.y), camera)

    raycaster.params.Line.threshold = pickThreshold(camera, viewer.controls.target)
    // Points are picked in screen space by `pickPoint`
    raycaster.params.Points.threshold = 0;

    (raycaster.params as typeof raycaster.params & { Line2?: { threshold: number } }).Line2 = { threshold: LINE2_PICK_PX }

    const hit = raycaster.intersectObjects(roots, true).find((hit) => {
        return !(hit.object instanceof THREE.Points) && isShown(hit.object) && accept(hit.object)
    }) ?? null

    const pointHit = pickPoint(camera, raycaster.ray, ndc, canvas, roots, accept)

    if (!pointHit) {
        return hit
    }

    // A point drawn behind a surface is hidden unless its material skips the depth test
    const isOccluded = !!hit && getPointMaterial(pointHit.object as THREE.Points).depthTest && pointHit.distance > hit.distance

    return isOccluded ? hit : pointHit
}
