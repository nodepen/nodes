import type * as NodePen from '@nodepen/core'
import { useCallbacks, useDispatch, useStore } from '$'
import { useEffect, useRef } from 'react'

export const useSolutionData = (): NodePen.DocumentSolutionData => {
  const solutionData = useStore((state) => state.solution)

  // const { solutionId } = solutionData

  // const currentSolutionId = useRef(solutionId)

  // // const { apply } = useDispatch()
  // const { onExpireSolution } = useCallbacks()

  // useEffect(() => {
  //   if (solutionId === currentSolutionId.current) {
  //     // Solution has not expired
  //     return
  //   }

  //   console.log(`🟢🟢🟢 New solution requested [${solutionId.split('-')[0]}]`)

  //   // TODO: Do we really need speckle streamObjectIds in core state? I don't think so.
  //   // apply((state) => {
  //   //   state.stream.objectIds = manifest.streamObjectIds
  //   // })

  //   onExpireSolution?.(useStore.getState())
  // }, [solutionId])

  return solutionData
}
