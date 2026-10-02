import React, { useCallback, useEffect, useRef } from 'react'
import * as THREE from 'three'
import { initThree, type ThreeViewer } from '@selvajs/visualization/render'
import type { Rhino3dmLoader } from 'three/addons/loaders/3DMLoader.js'
import { internalCallbacksRef, useDispatch, useStore } from '@/store'
import type { NodesAppState } from '@/store/state'
import { COLORS } from '@/constants'
import { useFlag } from '@/hooks/useFlag'
import { getNextSelection, getSelectionMode } from '@/utils/selection'
import { useThumbnailShutter } from '../hooks/useThumbnailShutter'
import { buildSelvaObjects, isRhinoModelUrl, loadSelvaModel } from './loadSelvaModel'
import { applySolutionStyle, disposeSolutionObjects, getSolutionAddress, indexSolutionObjects } from './solutionObjects'
import type { SolutionViewState } from './solutionStyle'
import {
    applyContextStyle,
    createReferenceModelLoader,
    disposeReferenceModel,
    getModelKey,
    isSelectable,
    loadReferenceModel
} from './referenceModels'
import { pickNearest } from './selvaPicking'

type SelvaCanvasProps = {
    solutionModelUrl: string | null
}

/** Below Selva's own measure tool (0) and view gizmo (-100), so either claims its clicks first. */
const PICK_TOOL_PRIORITY = -200

/** Whether an object is something drawn: a mesh (Selva's fat curves included), a line or points. */
const isDrawable = (object: THREE.Object3D): boolean => {
    return object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.Points
}

const getBounds = (roots: THREE.Object3D[], nodeInstanceId?: string, portInstanceId?: string): THREE.Box3 => {
    const bounds = new THREE.Box3()
    const objectBounds = new THREE.Box3()
    const isNarrowed = !!nodeInstanceId || !!portInstanceId

    for (const root of roots) {
        root.updateMatrixWorld(true)

        root.traverseVisible((object) => {
            if (!isDrawable(object)) {
                return
            }

            if (isNarrowed) {
                const address = getSolutionAddress(object)

                if (!address) {
                    return
                }

                if (nodeInstanceId && address.nodeInstanceId !== nodeInstanceId) {
                    return
                }

                if (portInstanceId && address.portInstanceId !== portInstanceId) {
                    return
                }
            }

            objectBounds.setFromObject(object)

            if (!objectBounds.isEmpty()) {
                bounds.union(objectBounds)
            }
        })
    }

    return bounds
}

/** Stretches the camera's far plane to reach everything in `bounds`. Selva refits the near plane itself. */
const fitFarPlane = (viewer: ThreeViewer, bounds: THREE.Box3): void => {
    if (bounds.isEmpty()) {
        return
    }

    const size = bounds.getSize(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)

    viewer.camera.far = Math.max(2000, maxDim * 20)
    viewer.camera.updateProjectionMatrix()
}

const getSolutionViewState = (state: NodesAppState): SolutionViewState => {
    return {
        isExpired: state.solution.flags.isModelExpired,
        selectedNodeIds: new Set(state.registry.selection.nodes),
        hiddenNodeIds: new Set(
            Object.entries(state.document.nodes)
                .filter(([, node]) => {
                    return node.status.isVisible === false
                })
                .map(([id]) => {
                    return id
                })
        ),
        hover: state.registry.hover
    }
}

/** The ids of hidden nodes, as one string, so a selector only re-renders when the set changes. */
const selectHiddenNodesKey = (state: NodesAppState): string => {
    return Object.entries(state.document.nodes)
        .filter(([, node]) => {
            return node.status.isVisible === false
        })
        .map(([id]) => {
            return id
        })
        .sort()
        .join(',')
}

type LoadedReferenceModel = {
    url: string
    root: THREE.Object3D | null
    isSettled: boolean
}

const SelvaCanvas = ({ solutionModelUrl }: SelvaCanvasProps) => {
    const { apply, clearInterface, clearSelection, selectNodes } = useDispatch()

    const isThumbnail = useFlag('isThumbnail')
    const isHomePage = useFlag('isHomePage')

    const showGrid = useStore((state) => {
        return state.geometry.showGrid
    })
    const referenceModels = useStore((state) => {
        return state.attachments.reference_model
    })

    // Only here to restyle when they change; `restyle` reads the store itself.
    const selectedNodes = useStore((state) => {
        return state.registry.selection.nodes
    })
    const hover = useStore((state) => {
        return state.registry.hover
    })
    const isExpired = useStore((state) => {
        return state.solution.flags.isModelExpired
    })
    const hiddenNodesKey = useStore(selectHiddenNodesKey)
    const modelState = useStore((state) => {
        return state.ui.model
    })

    const containerRef = useRef<HTMLDivElement>(null)
    const viewerRef = useRef<ThreeViewer | null>(null)
    const contentRef = useRef<THREE.Group | null>(null)
    const contextRef = useRef<THREE.Group | null>(null)
    const loaderRef = useRef<Rhino3dmLoader | null>(null)
    const referenceModelsRef = useRef(new Map<string, LoadedReferenceModel>())
    const hasFramedRef = useRef(false)

    /** Restyles everything drawn for the store's current state, and repaints. */
    const restyle = useCallback(() => {
        const viewer = viewerRef.current
        const content = contentRef.current
        const context = contextRef.current

        if (!viewer || !content || !context) {
            return
        }

        const state = useStore.getState()

        applySolutionStyle(content, getSolutionViewState(state))
        applyContextStyle(context, state.ui.model)

        viewer.invalidate()
    }, [])

    /** Whether the solution has arrived since this viewer was made, or there is none to wait for. */
    const isSolutionSettledRef = useRef(false)

    const frameInitial = useCallback(() => {
        const viewer = viewerRef.current
        const content = contentRef.current
        const context = contextRef.current

        if (!viewer || !content || !context || hasFramedRef.current) {
            return
        }

        const bounds = getBounds([content, context])

        if (bounds.isEmpty()) {
            return
        }

        fitFarPlane(viewer, bounds)
        viewer.cameraController.frameBounds(bounds, false)

        const isContextSettled = [...referenceModelsRef.current.values()].every((entry) => {
            return entry.isSettled
        })

        if (isSolutionSettledRef.current && isContextSettled) {
            hasFramedRef.current = true
        }
    }, [])

    const offerThumbnail = useThumbnailShutter(viewerRef)

    useEffect(() => {
        const container = containerRef.current

        if (!container) {
            return
        }

        const canvas = document.createElement('canvas')
        canvas.className = 'np-block np-w-full np-h-full'
        container.appendChild(canvas)

        const viewer = initThree(canvas, {
            look: 'technical',
            environment: {
                backgroundColor: COLORS.PALE,
                // Do not set to true: attempts to fetch an unavailable hdr
                enableEnvironmentLighting: false
            },
            lighting: {
                enableHemisphereLight: true,
                hemisphereIntensity: 1.2,
                ambientLightIntensity: 0.8
            },
            grid: {
                enabled: !isThumbnail && !isHomePage,
                cellSize: 1,
                majorEvery: 10,
                fadeDistance: 250,
                cellColor: 0xd6dbdb,
                majorColor: COLORS.DARKGREY
            },
            render: {
                ambientOcclusion: false,
                enableShadows: false,
                onDemand: !isHomePage,
                preserveDrawingBuffer: isThumbnail
            },
            events: {
                enableEventHandlers: false
            }
        })

        // Selva always fills the scene background (it falls back to its own grey when unset). Clear it so the
        // transparent canvas shows the parent's bg-pale. Thumbnails keep the fill since they're captured as-is.
        if (!isThumbnail) {
            viewer.scene.background = null
        }

        const content = new THREE.Group()
        content.name = 'nodepen-solution'
        viewer.scene.add(content)

        const context = new THREE.Group()
        context.name = 'nodepen-context'
        viewer.scene.add(context)

        const loader = createReferenceModelLoader()
        const referenceModels = referenceModelsRef.current

        viewer.grid?.setVisible(useStore.getState().geometry.showGrid)

        viewerRef.current = viewer
        contentRef.current = content
        contextRef.current = context
        loaderRef.current = loader
        hasFramedRef.current = false
        isSolutionSettledRef.current = false

        internalCallbacksRef.zoomToExtents = (nodeInstanceId?: string, portInstanceId?: string) => {
            const isNarrowed = !!nodeInstanceId || !!portInstanceId
            const bounds = getBounds(isNarrowed ? [content] : [content, context], nodeInstanceId, portInstanceId)

            if (bounds.isEmpty()) {
                return
            }

            viewer.cameraController.frameBounds(bounds, true)
        }

        const unregisterPickTool = isThumbnail || isHomePage
            ? () => { }
            : viewer.tools.register({
                id: 'nodepen',
                priority: PICK_TOOL_PRIORITY,
                tool: {
                    handleClick: (event: MouseEvent): boolean => {
                        const { ui } = useStore.getState()
                        const mode = getSelectionMode(event)

                        if (ui.model.mode === 'select') {
                            const pickState = ui.model

                            const hit = pickNearest(viewer, event, [context], (object) => {
                                return isDrawable(object)
                                    && typeof object.userData?.attributes?.id === 'string'
                                    && !!getModelKey(object)
                                    && isSelectable(object, pickState)
                            })

                            if (!hit) {
                                return true
                            }

                            const modelKey = getModelKey(hit.object)!
                            const guid: string = hit.object.userData.attributes.id

                            apply((state) => {
                                const current = state.ui.model.selection[modelKey] ?? []

                                state.ui.model.selection = {
                                    ...state.ui.model.selection,
                                    [modelKey]: getNextSelection(current, [guid], mode)
                                }
                            })

                            return true
                        }

                        const hit = pickNearest(viewer, event, [content], (object) => {
                            return !!getSolutionAddress(object)?.nodeInstanceId
                        })

                        const nodeInstanceId = hit ? getSolutionAddress(hit.object)?.nodeInstanceId : undefined

                        if (nodeInstanceId) {
                            selectNodes([nodeInstanceId], mode)
                        } else if (mode === 'set') {
                            clearSelection()
                        }

                        return true
                    }
                }
            })

        return () => {
            unregisterPickTool()

            for (const { root } of referenceModels.values()) {
                if (root) {
                    disposeReferenceModel(root)
                }
            }

            referenceModels.clear()
            loader.dispose()

            viewerRef.current = null
            contentRef.current = null
            contextRef.current = null
            loaderRef.current = null

            disposeSolutionObjects(content)
            viewer.dispose()
            canvas.remove()
        }
    }, [isThumbnail, isHomePage])

    useEffect(() => {
        viewerRef.current?.grid?.setVisible(showGrid)
        viewerRef.current?.invalidate()
    }, [showGrid])

    useEffect(() => {
        restyle()
    }, [restyle, selectedNodes, hover, isExpired, hiddenNodesKey, modelState])

    // The document's attached reference models
    useEffect(() => {
        const viewer = viewerRef.current
        const context = contextRef.current
        const loader = loaderRef.current

        if (!viewer || !context || !loader) {
            return
        }

        const loaded = referenceModelsRef.current
        const wanted = referenceModels ?? {}

        for (const [modelKey, entry] of [...loaded]) {
            if (wanted[modelKey] === entry.url) {
                continue
            }

            if (entry.root) {
                disposeReferenceModel(entry.root)
            }

            loaded.delete(modelKey)
            viewer.invalidate()
        }

        for (const [modelKey, url] of Object.entries(wanted)) {
            if (loaded.has(modelKey)) {
                continue
            }

            const entry: LoadedReferenceModel = { url, root: null, isSettled: false }
            loaded.set(modelKey, entry)

            loadReferenceModel(loader, modelKey, url)
                .then((root) => {
                    // Replaced or unmounted while it loaded.
                    if (loaded.get(modelKey) !== entry || viewerRef.current !== viewer) {
                        disposeReferenceModel(root)
                        return
                    }

                    entry.root = root
                    entry.isSettled = true
                    context.add(root)

                    restyle()
                    frameInitial()
                    offerThumbnail('context', getBounds([root]))
                })
                .catch((e) => {
                    console.error(`[ SelvaCanvas ] Could not load reference model ${modelKey}`, e)

                    if (loaded.get(modelKey) === entry) {
                        entry.isSettled = true
                        frameInitial()
                        offerThumbnail('context', new THREE.Box3())
                    }
                })
        }
    }, [referenceModels, isThumbnail, isHomePage, restyle, frameInitial, offerThumbnail])

    // The solution's display model
    useEffect(() => {
        const viewer = viewerRef.current
        const content = contentRef.current

        if (!viewer || !content) {
            return
        }

        let isCurrent = true

        if (!solutionModelUrl) {
            if (useStore.getState().solution.flags.isFailed) {
                disposeSolutionObjects(content)
                content.clear()
                viewer.invalidate()
            }

            isSolutionSettledRef.current = true
            frameInitial()
            offerThumbnail('solution', new THREE.Box3())

            return
        }

        if (isRhinoModelUrl(solutionModelUrl)) {
            apply((state) => {
                state.solution.flags.isModelExpired = false
                state.solution.messages.model = {
                    status: 'error',
                    message: 'This solution was saved before the Selva viewer. Re-solve to view it.'
                }
            })

            isSolutionSettledRef.current = true
            frameInitial()
            offerThumbnail('solution', new THREE.Box3())

            return
        }

        const load = async () => {
            try {
                const batch = await loadSelvaModel(solutionModelUrl)

                if (!isCurrent) {
                    return
                }

                const objects = await buildSelvaObjects(batch, viewer.getMaterialAppearance())

                if (!isCurrent) {
                    return
                }

                disposeSolutionObjects(content)
                content.clear()
                content.add(...objects)

                indexSolutionObjects(content)

                apply((state) => {
                    state.solution.flags.isModelExpired = false
                    state.solution.messages.model = {
                        status: 'ok',
                        message: `Loaded ${objects.length} objects.`
                    }
                })

                restyle()
                isSolutionSettledRef.current = true
                frameInitial()
                fitFarPlane(viewer, getBounds([content, contextRef.current ?? content]))

                const state = useStore.getState()

                if (state.app.flags.isHomePage) {
                    setTimeout(() => {
                        internalCallbacksRef.zoomToExtents?.()
                        state.callbacks.onHomePageReady?.(useStore.getState())
                    }, 1000)
                }

                offerThumbnail('solution', getBounds([content]))
            } catch (e) {
                if (!isCurrent) {
                    return
                }

                console.error('[ SelvaCanvas ] Could not load display model', e)

                isSolutionSettledRef.current = true
                frameInitial()

                apply((state) => {
                    state.solution.messages.model = {
                        status: 'error',
                        message: e instanceof Error ? e.message : 'Could not load display model.'
                    }
                })

                offerThumbnail('solution', new THREE.Box3())
            }
        }

        load()

        return () => {
            isCurrent = false
        }
    }, [solutionModelUrl, isThumbnail, isHomePage, restyle, frameInitial, offerThumbnail])

    return (
        <div
            className="np-w-full np-h-full np-relative"
            onPointerDown={() => {
                clearInterface()
            }}
        >
            <div ref={containerRef} className="np-w-full np-h-full" />
        </div>
    )
}

export default React.memo(SelvaCanvas, (prev, next) => {
    return prev.solutionModelUrl === next.solutionModelUrl
})
