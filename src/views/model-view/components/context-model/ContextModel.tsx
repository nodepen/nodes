import * as THREE from 'three'
import { useDispatch, useStore } from '@/store'
import { useLoader, type ThreeEvent } from '@react-three/fiber'
import React, { memo, Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { shallow } from 'zustand/shallow'
import { Rhino3dmLoader } from 'three/addons/loaders/3DMLoader.js'
import { LINE, MESH } from '../../materials'
import { DARK, DARKGREY, GREEN } from '../../materials/colors'
import { isGeometryType } from '@/utils/three/isGeometryType'
import { registerModelObjects, unregisterModel } from '@/utils/three/referenceIndex'
import { useThumbnailShutter } from '../../hooks/useThumbnailShutter'

/** All reference models attached to current document. Drawn as background geometry. */
const ContextModel = () => {
    const models = useStore(
        (state) => state.attachments.reference_model ?? EMPTY_MODELS,
        shallow
    )

    const entries = useMemo(() => Object.entries(models), [models])

    return <>
        {entries.map(([modelKey, modelUrl]) => (
            <Suspense key={modelKey} fallback={null}>
                <ContextModelGeometry modelKey={modelKey} modelUrl={modelUrl} />
            </Suspense>
        ))}
    </>
}

const EMPTY_MODELS: Record<string, string> = {}

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
    const activeSelection = useStore((state) => state.ui.model.selection[modelKey] ?? EMPTY_SELECTION, shallow)

    const selectedGuids = useMemo(() => new Set(activeSelection), [activeSelection])

    const [sceneObjects, setSceneObjects] = useState<THREE.Object3D[]>([])

    const offerThumbnailSubject = useThumbnailShutter(sceneObjects)

    useEffect(() => {
        const objects: THREE.Object3D[] = []
        const byGuid = new Map<string, THREE.Object3D>()

        const bounds = new THREE.Box3()
        const tempBounds = new THREE.Box3()

        documentObject.updateMatrixWorld(true)

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

            const geometry = (object as THREE.Object3D & { geometry?: THREE.BufferGeometry }).geometry

            if (geometry) {
                if (!geometry.boundingBox) {
                    geometry.computeBoundingBox()
                }

                if (geometry.boundingBox) {
                    tempBounds.copy(geometry.boundingBox).applyMatrix4(object.matrixWorld)
                    bounds.union(tempBounds)
                }
            }

            // Rhino guid
            const guid = object.userData?.attributes?.id

            if (typeof guid === 'string') {
                byGuid.set(guid, object)
            }

            objects.push(object)
        })

        setSceneObjects(objects)
        registerModelObjects(modelKey, byGuid)

        const state = useStore.getState()

        if (state.app.flags.isThumbnail) {
            const callback = state.callbacks.onThumbnailReady

            offerThumbnailSubject('context', bounds, () => callback?.(state))
        }
    }, [documentObject, modelKey])

    // CLean up registry on model dismount
    useEffect(() => {
        return () => {
            unregisterModel(modelKey)
        }
    }, [modelKey])

    const handleClickGeometry = useCallback((e: ThreeEvent<MouseEvent>, o: THREE.Object3D<THREE.Object3DEventMap>) => {
        e.stopPropagation()

        const modelState = useStore.getState().ui.model

        if (e.ctrlKey) {
            console.log(o)
        }

        const guid = o.userData?.attributes?.id

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
            const isSelected = selectedGuids.has(guid)

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

const EMPTY_SELECTION: string[] = []

export default memo(ContextModel)
