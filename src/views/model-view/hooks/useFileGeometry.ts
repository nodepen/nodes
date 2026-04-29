import * as THREE from 'three'
import { useLoader } from '@react-three/fiber'
import { Rhino3dmLoader } from 'three/examples/jsm/loaders/3DMLoader'
import { useEffect, useState } from 'react'

type FileGeometry = {
    type: 'point' | 'line' | 'mesh'
    object: THREE.Object3D
}

export const useFileGeometry = (url: string): FileGeometry[] => {
    const objects = useLoader(Rhino3dmLoader, url, (loader) => {
        loader.setLibraryPath('https://cdn.jsdelivr.net/npm/rhino3dm@8.0.1/')
    })

    const [fileGeometry, setFileGeometry] = useState<FileGeometry[]>([])

    useEffect(() => {
        const nextGeometry: FileGeometry[] = []

        objects.traverse((object) => {
            if (object instanceof THREE.Points) {
                nextGeometry.push({
                    type: 'point',
                    object,
                })
            }

            if (object instanceof THREE.Line) {
                nextGeometry.push({
                    type: 'line',
                    object
                })
            }

            if (object instanceof THREE.Mesh) {
                nextGeometry.push({
                    type: 'mesh',
                    object
                })
            }
        })

        setFileGeometry(nextGeometry)
    }, [objects])

    return fileGeometry
}