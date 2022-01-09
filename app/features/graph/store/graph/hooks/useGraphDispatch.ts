import { NodePen } from 'glib'
import { useAppDispatch } from '$'
import { graphActions } from '../graphSlice'
import { solutionActions } from '../../solution/solutionSlice'
import { Payload, WireMode } from '../types'
import { ActionCreators } from 'redux-undo'
import { GraphMode } from '../types/GraphMode'

/* eslint-disable-next-line */
export const useGraphDispatch = () => {
  const dispatch = useAppDispatch()

  return {
    undo: () => {
      dispatch(ActionCreators.undo())
      dispatch(solutionActions.expireSolution())
    },
    redo: () => {
      dispatch(ActionCreators.redo())
      dispatch(solutionActions.expireSolution())
    },
    reset: () => {
      dispatch(graphActions.reset())
      dispatch(solutionActions.expireSolution())
    },
    restore: (manifest: NodePen.GraphManifest, expireSolution = true) => {
      dispatch(graphActions.restore(manifest))

      if (expireSolution) {
        dispatch(solutionActions.expireSolution())
      }
    },
    setGraphElements: (elements: NodePen.GraphElementsMap) => {
      dispatch(graphActions.setGraphElements(elements))
    },
    setGraphName: (name: string) => {
      dispatch(graphActions.setGraphName(name))
    },
    setGraphFileUrl: (file: keyof NodePen.GraphManifest['files'], url: string) => {
      dispatch(graphActions.setGraphFileUrl({ file, url }))
    },
    addElement: (data: Payload.AddElementPayload<NodePen.ElementType>) => {
      dispatch(graphActions.addElement(data))
      dispatch(solutionActions.expireSolution())
    },
    addLiveElement: (data: Payload.AddElementPayload<NodePen.ElementType>) =>
      dispatch(graphActions.addLiveElement(data)),
    updateElement: (data: Payload.UpdateElementPayload<NodePen.ElementType>) => {
      dispatch(graphActions.updateElement(data))

      if ('values' in data.data) {
        // Not all 'patch' operations require generating a new solution.
        dispatch(solutionActions.expireSolution())
      }
    },
    batchUpdateLiveElement: (data: Payload.UpdateElementPayload<NodePen.ElementType>[]) => {
      dispatch(graphActions.batchUpdateLiveElement(data))
    },
    updateLiveElement: (data: Payload.UpdateElementPayload<NodePen.ElementType>) => {
      dispatch(graphActions.updateLiveElement(data))
    },
    deleteElements: (ids: string[]) => {
      dispatch(graphActions.deleteElements(ids))
      dispatch(solutionActions.expireSolution())
    },
    deleteLiveElements: (ids: string[]) => {
      dispatch(graphActions.deleteLiveElements(ids))
    },
    moveElement: (id: string, position: [number, number]) => {
      dispatch(graphActions.moveElement({ id, position }))
    },
    updateSelection: (data: Payload.UpdateSelectionPayload) => {
      dispatch(graphActions.updateSelection(data))
    },
    prepareLiveMotion: (data: Payload.PrepareLiveMotionPayload) => {
      dispatch(graphActions.prepareLiveMotion(data))
    },
    dispatchLiveMotion: (dx: number, dy: number) => {
      dispatch(graphActions.dispatchLiveMotion([dx, dy]))
    },
    startLiveWires: (data: Payload.StartLiveWiresPayload) => {
      dispatch(graphActions.startLiveWires(data))
    },
    updateLiveWires: (x: number, y: number) => {
      dispatch(graphActions.updateLiveWires([x, y]))
    },
    captureLiveWires: (data: Payload.CaptureLiveWiresPayload) => {
      dispatch(graphActions.captureLiveWires(data))
    },
    releaseLiveWires: () => {
      dispatch(graphActions.releaseLiveWires())
    },
    endLiveWires: (mode: WireMode | 'cancel', end?: [number, number]) => {
      dispatch(graphActions.endLiveWires({ mode, end }))
      dispatch(solutionActions.expireSolution())
    },
    setProvisionalWire: (data: Payload.ProvisionalWirePayload) => {
      dispatch(graphActions.setProvisionalWire(data))
    },
    clearProvisionalWire: () => {
      dispatch(graphActions.clearProvisionalWire())
    },
    setMode: (mode: GraphMode) => {
      dispatch(graphActions.setMode(mode))
    },
    toggleVisibility: (ids: string[]) => {
      dispatch(graphActions.toggleVisibility({ ids }))
    },
    setVisibility: (ids: string[], visibility: 'visible' | 'hidden') => {
      dispatch(graphActions.setVisibility({ ids, visibility }))
    },
    registerElement: (data: Payload.RegisterElementPayload) => {
      dispatch(graphActions.registerElement(data))
    },
    registerElementAnchor: (data: Payload.RegisterElementAnchorPayload) => {
      dispatch(graphActions.registerElementAnchor(data))
    },
  }
}
