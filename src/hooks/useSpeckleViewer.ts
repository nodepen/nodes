import { useStore } from '$'
import { SpeckleObjectLoaderContext } from '@/context'
import { useContext, useEffect, useRef } from 'react'

// Watches document state and keeps viewer graphics in sync
export const useSpeckleViewer = () => {
  const context = useContext(SpeckleObjectLoaderContext)

  const selection = useStore((state) => state.registry.selection.nodes)

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
          objectIds.push(solutionData.id)
        }
      }

      await viewer.current.selectObjects(objectIds)
    }

    updateSelection()
  }, [selection])
}