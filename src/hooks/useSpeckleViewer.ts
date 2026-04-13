import { useStore } from '$'
import { SpeckleObjectLoaderContext } from '@/context'
import { useContext, useEffect, useRef } from 'react'

// Watches document state and keeps viewer graphics in sync
export const useSpeckleViewer = () => {
    const context = useContext(SpeckleObjectLoaderContext)

    const selection = useStore((state) => state.registry.selection.nodes)
    const hidden = useStore((state) => Object.values(state.document.nodes).filter((node) => !node.status.isVisible))
    const previousHiddenObjectIds = useRef<string[]>([])

    useEffect(() => {
        const viewer = context?.viewer
        const state = useStore.getState()

        const updateSelection = async () => {
            if (!viewer?.current) {
                return
            }

            await viewer.current.resetSelection()

            const objectIds: string[] = []
            for (const nodeInstanceId of selection) {
                const solutionData = state.solution.nodeSolutionData.find((data) => data.nodeInstanceId === nodeInstanceId)
                if (solutionData) {
                    if (!previousHiddenObjectIds.current.includes(solutionData.id)) {
                        objectIds.push(solutionData.id)
                    }
                }
            }

            await viewer.current.selectObjects(objectIds)
        }

        updateSelection()
    }, [selection])



    useEffect(() => {
        const viewer = context?.viewer
        const state = useStore.getState()

        if (!viewer?.current || state.lifecycle.solution === 'expired') {
            return
        }

        const objectIdsToShow: string[] = []
        const objectIdsToHide: string[] = []

        for (const node of hidden) {
            const solutionData = state.solution.nodeSolutionData.find((data) => data.nodeInstanceId === node.instanceId)
            if (solutionData) {
                objectIdsToHide.push(solutionData.id)
            }
        }

        for (const objectId of previousHiddenObjectIds.current) {
            if (!objectIdsToHide.includes(objectId)) {
                objectIdsToShow.push(objectId)
            }
        }

        previousHiddenObjectIds.current = objectIdsToHide

        viewer.current.showObjects(objectIdsToShow, undefined, true)
        viewer.current.hideObjects(objectIdsToHide, undefined, true)
        viewer.current.resetSelection()
    }, [hidden])
}