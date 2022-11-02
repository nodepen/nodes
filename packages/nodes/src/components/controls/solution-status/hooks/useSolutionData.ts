import type * as NodePen from '@nodepen/core'
import { useCallbacks, useDispatch, useStore } from '$'
import { useEffect, useRef } from 'react'

export const useSolutionData = (): NodePen.SolutionData => {
    const solutionData = useStore((state) => state.solution)

    const { id, manifest } = solutionData

    const currentSolutionId = useRef(id)

    const { apply } = useDispatch()
    const { onExpireSolution } = useCallbacks()

    useEffect(() => {
        if (id === currentSolutionId.current) {
            // Solution has not expired
            return
        }

        console.log(`🟢🟢🟢 New solution requested [${id.split('-')[0]}]`)

        apply((state) => {
            state.stream.objectIds = manifest.streamObjectIds
        })

        onExpireSolution?.(useStore.getState())
    }, [id])

    return solutionData
}