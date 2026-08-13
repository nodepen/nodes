import * as THREE from 'three'
import { useDispatch, useStore } from '@/store'
import { useLoader, type ThreeEvent } from '@react-three/fiber'
import React, { act, memo, useCallback, useEffect, useState } from 'react'
import { Rhino3dmLoader } from 'three/addons/loaders/3DMLoader.js'
import { LINE, MESH } from '../../materials'
import { DARK, DARKGREY, GREEN } from '../../materials/colors'
import { isGeometryType } from '@/utils/three/isGeometryType'

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
    }, (e) => {
        // console.log(`${e.loaded} / ${e.total}`)
    })

    const { apply } = useDispatch()

    const modelState = useStore((state) => state.ui.model)
    const activeSelection = useStore((state) => state.ui.model.selection[modelKey] ?? [])

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

    const handleClickGeometry = useCallback((e: ThreeEvent<MouseEvent>, o: THREE.Object3D<THREE.Object3DEventMap>) => {
        e.stopPropagation()

        const modelState = useStore.getState().ui.model

        if (e.ctrlKey) {
            console.log(o)
        }

        const guid = o.userData?.attributes?.id
        const type = o.userData?.objectType

        switch (modelState.mode) {
            case 'default': {
                // Select or something
                // `case 'default':` is kind of funny
                return
            }
            case 'select': {
                const { selectionFilter } = modelState

                const isSelectable = selectionFilter.some((type) => isGeometryType(o, type))
                if (!isSelectable) {
                    return
                }

                const selectionMode = e.shiftKey ? 'add' : e.ctrlKey ? 'remove' : 'set'

                const nextSelection = new Set<string>(useStore.getState().ui.model.selection[modelKey])

                switch (selectionMode) {
                    case 'set': {
                        nextSelection.clear()
                        nextSelection.add(guid)
                        break
                    }
                    case 'add': {
                        nextSelection.add(guid)
                        break
                    }
                    case 'remove': {
                        nextSelection.delete(guid)
                        break
                    }
                }

                apply((state) => {
                    state.ui.model.selection = {
                        ...state.ui.model.selection,
                        [modelKey]: [...nextSelection]
                    }
                })
            }
        }
    }, [modelKey])

    return <group dispose={null}>
        {sceneObjects.map((o) => {
            const guid = o.userData?.attributes?.id

            const isSelectable = modelState.mode === 'select' ? modelState.selectionFilter.some((type) => isGeometryType(o, type)) : true
            const isSelected = activeSelection.includes(guid)

            if (o instanceof THREE.Points) {
                const color = isSelected ? GREEN : isSelectable ? DARK : DARKGREY

                return (
                    <points key={`${modelKey}-${o.geometry?.uuid ?? o.uuid ?? o.id}`} geometry={o.geometry} onClick={(e) => handleClickGeometry(e, o)}>
                        <pointsMaterial color={color} size={7} sizeAttenuation={false} />
                    </points>
                )
            }

            if (o instanceof THREE.Line) {
                const material = isSelected ? LINE.SELECTED : isSelectable ? LINE.CONTEXT : LINE.EXPIRED
                // @ts-expect-error react-three-fibre line vs svg line
                return <line key={`${modelKey}-${o.geometry?.uuid ?? o.uuid ?? o.id}`} geometry={o.geometry} material={material} onClick={(e) => handleClickGeometry(e, o)} />
            }

            if (o instanceof THREE.Mesh) {
                const material = isSelected ? MESH.SELECTED : isSelectable ? MESH.CONTEXT : MESH.EXPIRED

                return <mesh key={`${modelKey}-${o.geometry?.uuid ?? o.uuid ?? o.id}`} geometry={o.geometry} material={material} onClick={(e) => handleClickGeometry(e, o)} />
            }

            return null
        })}
    </group>
}

export default memo(ContextModel)