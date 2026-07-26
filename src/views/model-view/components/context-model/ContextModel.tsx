import * as THREE from 'three'
import { useDispatch, useStore } from '@/store'
import { useLoader, type ThreeEvent } from '@react-three/fiber'
import React, { act, memo, useCallback, useEffect, useState } from 'react'
import { Rhino3dmLoader } from 'three/examples/jsm/loaders/3DMLoader'
import { LINE, MESH } from '../../materials'
import { DARK, DARKGREY, GREEN } from '../../materials/colors'

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

    const handleClickGeometry = useCallback((e: ThreeEvent<MouseEvent>, o: THREE.Object3D<THREE.Event>) => {
        const modelState = useStore.getState().ui.model

        const guid = o.userData?.attributes?.id
        const type = o.userData?.objectType

        // console.log(e)

        switch (modelState.mode) {
            case 'default': {
                // Select or something
                // `case 'default':` is kind of funny
                return
            }
            case 'select': {
                const { selectionFilter } = modelState

                const selectionMode = e.shiftKey ? 'add' : e.ctrlKey ? 'remove' : 'set'

                if (!selectionFilter.includes(type)) {
                    return
                }

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

    return <>
        {sceneObjects.map((o) => {
            const guid = o.userData?.attributes?.id
            const type = o.userData?.objectType

            const isSelectable = modelState.mode === 'select' ? modelState.selectionFilter.includes(type) : true
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
                const material = isSelectable ? LINE.CONTEXT : LINE.EXPIRED
                // @ts-expect-error react-three-fibre line vs svg line
                return <line key={`${modelKey}-${o.geometry?.uuid ?? o.uuid ?? o.id}`} geometry={o.geometry} material={material} onClick={(e) => handleClickGeometry(e, o)} />
            }

            if (o instanceof THREE.Mesh) {
                const material = isSelectable ? MESH.CONTEXT : MESH.EXPIRED

                return <mesh key={`${modelKey}-${o.geometry?.uuid ?? o.uuid ?? o.id}`} geometry={o.geometry} material={material} onClick={(e) => handleClickGeometry(e, o)} />
            }

            return null
        })}
    </>
}

export default memo(ContextModel)