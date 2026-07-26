import * as THREE from 'three'
import { useStore } from '@/store'
import { useLoader } from '@react-three/fiber'
import { memo, useEffect, useState } from 'react'
import { Rhino3dmLoader } from 'three/examples/jsm/loaders/3DMLoader'
import { LINE, MESH } from '../../materials'

const ContextModel = () => {
    const model = useStore((state) => {
        // One model for now
        const entry = Object.entries(state.assets.models).at(0)

        if (!entry) {
            return null
        }

        return [entry[0], entry[1]]
    })

    if (!model) {
        return null
    }

    const [modelKey, modelUrl] = model

    return <ContextModelGeometry modelKey={modelKey} modelUrl={modelUrl} />
}

type ContextModelGeometryProps = {
    modelKey: string
    modelUrl: string
}

const ContextModelGeometry = ({ modelKey, modelUrl }: ContextModelGeometryProps) => {
    const documentObject = useLoader(Rhino3dmLoader, modelUrl, (loader) => {
        loader.setLibraryPath('https://cdn.jsdelivr.net/npm/rhino3dm@8.0.1/')
    })

    const [sceneObjects, setSceneObjects] = useState<THREE.Object3D[]>([])

    useEffect(() => {
        const objects: THREE.Object3D[] = []

        documentObject.traverse((object) => {
            if (object instanceof THREE.Mesh && object.geometry) {
                const geometry = object.geometry

                if (geometry.isBufferGeometry) {
                    geometry.computeVertexNormals()
                    geometry.computeBoundingSphere()

                    if (geometry.attributes.normal) {
                        geometry.attributes.normal.needsUpdate = true
                    }
                }
            }

            objects.push(object)
        })

        setSceneObjects(objects)
    }, [documentObject])

    return <>
        {sceneObjects.map((o) => {
            if (o instanceof THREE.Points) {
                return (
                    <points key={`${modelKey}-${o.geometry?.uuid ?? o.uuid ?? o.id}`} geometry={o.geometry}>
                        <pointsMaterial color={0x414141} size={7} sizeAttenuation={false} />
                    </points>
                )
            }

            if (o instanceof THREE.Line) {
                // @ts-expect-error react-three-fibre line vs svg line
                return <line key={`${modelKey}-${o.geometry?.uuid ?? o.uuid ?? o.id}`} geometry={o.geometry} material={LINE.CONTEXT} />
            }

            if (o instanceof THREE.Mesh) {
                return <mesh key={`${modelKey}-${o.geometry?.uuid ?? o.uuid ?? o.id}`} geometry={o.geometry} material={MESH.CONTEXT} />
            }

            return null
        })}
    </>
}

export default memo(ContextModel)