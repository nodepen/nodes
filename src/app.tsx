import React, { useCallback, useEffect } from 'react'
import type * as NodePen from '@/types'
import { freeze } from 'immer'
import { useDispatch, useStore } from '$'
import type { NodesAppCallbacks } from '$'
import { ControlsContainer } from '@/components'
import { PseudoShadowsContainer } from './views/common'
import { StaticDialogLayer } from './views/static/dialog-layer'
import { DocumentView, ModelView } from './views'

type NodesAppProps = {
    document: NodePen.Document
    solution: NodePen.DocumentSolutionData | null
    templates: NodePen.NodeTemplate[]
    assets: NodePen.DocumentAssets
    user?: {
        name?: string
        email?: string
        image?: string
        token?: string
    }
} & NodesAppCallbacks

export const NodesApp = ({
    document,
    templates,
    user,
    solution,
    assets,
    ...callbacks
}: NodesAppProps): React.ReactElement => {
    const { apply, loadDocument, loadTemplates } = useDispatch()

    useEffect(() => {
        loadDocument(document)
    }, [document.id])

    useEffect(() => {
        apply((state) => {
            state.assets = assets
        })
    }, [assets])

    useEffect(() => {
        loadTemplates(templates ?? [])
    }, [templates])

    useEffect(() => {
        apply((state) => {
            state.user = user
        })
    }, [user])

    useEffect(() => {
        apply((state) => {
            state.callbacks = callbacks
        })
    }, [callbacks])

    useEffect(() => {
        if (!solution) {
            return
        }

        apply((state) => {
            state.solution = freeze(solution)
        })
    }, [solution])

    return <NodesAppInternal />
}

const NodesAppInternal = React.memo(() => {
    const canvasRootRef = useStore((state) => state.registry.canvasRoot)

    const { apply } = useDispatch()

    const handleDragEnter = useCallback((_e: React.DragEvent<HTMLDivElement>) => {
        apply((state) => {
            if (state.layout.fileUpload.isActive) {
                return
            }

            state.layout.fileUpload = {
                isActive: true,
                activeFile: null,
                uploadStatus: 'none',
            }
        })
    }, [])

    return (
        <div
            id="np-app-root"
            className="np-w-full np-h-full np-relative np-overflow-hidden no-drag"
            ref={canvasRootRef}
            onDragStart={(e) => e.preventDefault()}
        >
            {/* <FileUploadOverlayContainer /> */}
            <ControlsContainer />
            <PseudoShadowsContainer />
            <StaticDialogLayer />
            <DocumentView />
            <ModelView />
        </div>
    )
})
