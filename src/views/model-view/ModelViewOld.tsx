import React, { useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { Rhino3dmLoader } from "three/examples/jsm/loaders/3DMLoader"
import { Layer } from "../common"
import { useViewRegistry } from "../common/hooks"
import { useStore } from "@/store"
import { tryParseUserStrings } from "@/utils/three/tryParseUserStrings"

type ModelViewProps = {
    solutionModelUrl: string | null
}

const MESH_DEFAULT_MATERIAL = new THREE.MeshStandardMaterial({
    color: 0xe05a5a,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.6
})
const LINE_DEFAULT_MATERIAL = new THREE.LineBasicMaterial({
    color: 0xe05a5a,
})

const MESH_SELECTED_MATERIAL = new THREE.MeshStandardMaterial({
    color: 0x4caf7d,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.6
})
const LINE_SELECTED_MATERIAL = new THREE.LineBasicMaterial({
    color: 0x4caf7d,
})


const disposeMaterial = (material: THREE.Material | THREE.Material[] | any) => {
    if (Array.isArray(material)) {
        material.forEach(disposeMaterial)
        return
    }

    const mat = material as Record<string, any>

    if (!mat) {
        return
    }

    if (mat.map) mat.map.dispose()
    if (mat.lightMap) mat.lightMap.dispose()
    if (mat.aoMap) mat.aoMap.dispose()
    if (mat.emissiveMap) mat.emissiveMap.dispose()
    if (mat.bumpMap) mat.bumpMap.dispose()
    if (mat.normalMap) mat.normalMap.dispose()
    if (mat.displacementMap) mat.displacementMap.dispose()
    if (mat.roughnessMap) mat.roughnessMap.dispose()
    if (mat.metalnessMap) mat.metalnessMap.dispose()
    if (mat.alphaMap) mat.alphaMap.dispose()
    if (mat.envMap) mat.envMap.dispose()

    if (typeof mat.dispose === "function") {
        mat.dispose()
    }
}

const disposeHierarchy = (object: THREE.Object3D) => {
    object.traverse((child) => {
        if (child instanceof THREE.Mesh) {
            child.geometry.dispose()
            if (child.userData._originalMaterial) {
                disposeMaterial(child.userData._originalMaterial)
            }
        }
    })
}

const ModelView = ({ solutionModelUrl }: ModelViewProps) => {
    const [position, preciseWidth] = useViewRegistry({ key: 'model', label: 'Model' })

    const containerRef = useRef<HTMLDivElement>(null)
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
    const sceneRef = useRef<THREE.Scene | null>(null)
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
    const controlsRef = useRef<OrbitControls | null>(null)
    const loaderRef = useRef<Rhino3dmLoader | null>(null)
    const modelGroupsRef = useRef(new Map<string, THREE.Group>())
    const currentUrlRef = useRef<string | null>(null)
    const animationFrameRef = useRef<number | null>(null)

    const width = Math.round(preciseWidth * 1000) / 1000
    const translation = (100 - (width * 100)) / -2

    const isExpired = useStore((state) => state.solution.isExpired)
    const selection = useStore((state) => state.registry.selection.nodes)
    const visible = useStore((state) => Object.values(state.document.nodes).filter((node) => node.status.isVisible).map((node) => node.instanceId))

    const applyMaterial = (object: THREE.Object3D, nodeInstanceId?: string, portInstanceId?: string) => {
        if ("material" in object) {
            if (!object.userData._originalMaterial) {
                object.userData._originalMaterial = object.material
            }
        }

        if (!nodeInstanceId) {
            return
        }

        object.visible = visible.includes(nodeInstanceId)

        if (object instanceof THREE.Mesh) {
            object.material = selection.includes(nodeInstanceId) ? MESH_SELECTED_MATERIAL : MESH_DEFAULT_MATERIAL
            return
        }

        if (object instanceof THREE.Line) {
            object.material = selection.includes(nodeInstanceId) ? LINE_SELECTED_MATERIAL : LINE_DEFAULT_MATERIAL
            return
        }
    }

    useEffect(() => {
        sceneRef.current?.traverse((object) => {
            const { nodeInstanceId, portInstanceId } = tryParseUserStrings(object)
            applyMaterial(object, nodeInstanceId, portInstanceId)
        })
    }, [selection, visible])

    useEffect(() => {
        if (!containerRef.current) return

        // @ts-expect-error This is correct actually
        THREE.Object3D.DEFAULT_UP.set(0, 0, 1)

        const container = containerRef.current
        const scene = new THREE.Scene()
        scene.background = new THREE.Color(0xf8fafc)

        const camera = new THREE.PerspectiveCamera(45, container.clientWidth / Math.max(container.clientHeight, 1), 0.1, 1000)
        camera.position.set(5, 5, 10)

        const ambientLight = new THREE.AmbientLight(0xffffff, 1.0)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
        directionalLight.position.set(10, 10, 10)

        scene.add(ambientLight, directionalLight)

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.setSize(container.clientWidth, container.clientHeight, false)
        renderer.domElement.style.width = "100%"
        renderer.domElement.style.height = "100%"
        renderer.domElement.style.display = "block"
        container.appendChild(renderer.domElement)

        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true
        controls.dampingFactor = 0.05
        controls.update()

        sceneRef.current = scene
        cameraRef.current = camera
        rendererRef.current = renderer
        controlsRef.current = controls

        const resize = () => {
            if (!containerRef.current || !cameraRef.current || !rendererRef.current) return
            const width = containerRef.current.clientWidth
            const height = containerRef.current.clientHeight
            cameraRef.current.aspect = width / Math.max(height, 1)
            cameraRef.current.updateProjectionMatrix()
            rendererRef.current.setSize(width, height, false)
        }

        const animate = () => {
            controls.update()
            renderer.render(scene, camera)
            animationFrameRef.current = requestAnimationFrame(animate)
        }

        window.addEventListener("resize", resize)
        animate()

        return () => {
            window.removeEventListener("resize", resize)
            if (animationFrameRef.current !== null) {
                cancelAnimationFrame(animationFrameRef.current)
            }
            controls.dispose()
            renderer.dispose()
            scene.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    child.geometry.dispose()
                    if (child.material) disposeMaterial(child.userData._originalMaterial)
                }
            })
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement)
            }
        }
    }, [])

    useEffect(() => {
        const scene = sceneRef.current
        const camera = cameraRef.current
        const controls = controlsRef.current
        const loader = loaderRef.current ?? new Rhino3dmLoader()

        if (!scene || !camera || !controls) return

        const unloadModel = (url?: string | null) => {
            if (!url) return
            const group = modelGroupsRef.current.get(url)
            if (!group) return
            scene.remove(group)
            disposeHierarchy(group)
            modelGroupsRef.current.delete(url)
        }

        const fitCameraToObject = (object: THREE.Object3D) => {
            const box = new THREE.Box3().setFromObject(object)
            const center = new THREE.Vector3()
            const size = new THREE.Vector3()
            box.getCenter(center)
            box.getSize(size)
            const maxSize = Math.max(size.x, size.y, size.z)
            const fitDistance = Math.max(maxSize * 1.5, 1)

            camera.position.copy(center).add(new THREE.Vector3(fitDistance, fitDistance, fitDistance))
            camera.lookAt(center)
            camera.updateProjectionMatrix()
            controls.target.copy(center)
            controls.update()
        }

        const previousUrl = currentUrlRef.current
        if (!solutionModelUrl) {
            unloadModel(previousUrl)
            currentUrlRef.current = null
            return
        }

        if (previousUrl === solutionModelUrl) {
            return
        }

        unloadModel(previousUrl)
        currentUrlRef.current = solutionModelUrl
        loaderRef.current = loader

        const modelGroup = new THREE.Group()
        modelGroup.name = solutionModelUrl
        scene.add(modelGroup)
        modelGroupsRef.current.set(solutionModelUrl, modelGroup)

        loader.setLibraryPath('https://cdn.jsdelivr.net/npm/rhino3dm@8.0.1/')
        loader.load(
            solutionModelUrl,
            (object) => {
                modelGroup.add(object)
                fitCameraToObject(object)
                object.traverse((o) => {
                    const { nodeInstanceId, portInstanceId } = tryParseUserStrings(o)
                    applyMaterial(o, nodeInstanceId, portInstanceId)
                })
            },
            undefined,
            (error) => {
                console.error("Failed to load Rhino model:", error)
            }
        )
    }, [solutionModelUrl])

    return (
        <Layer id="np-model-layer" position={position} z={10}>
            <div
                className="np-w-full np-h-full np-pointer-events-auto np-bg-pale"
                ref={containerRef}
                style={{ transform: `translateX(${translation}%)` }}
            />
        </Layer>
    )
}

export default React.memo(ModelView)
