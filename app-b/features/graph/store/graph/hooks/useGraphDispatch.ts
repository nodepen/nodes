import { NodePen } from 'glib'
import { useAppDispatch } from '$'
import { graphActions } from '../graphSlice'
import { Payload, WireMode } from '../types'
import { ActionCreators } from 'redux-undo'
import { GraphMode } from '../types/GraphMode'

export const useGraphDispatch = () => {
  const dispatch = useAppDispatch()

  return {
    undo: () => dispatch(ActionCreators.undo()),
    redo: () => dispatch(ActionCreators.redo()),
    reset: () => dispatch(graphActions.reset()),
    addElement: (data: Payload.AddElementPayload<NodePen.ElementType>) => dispatch(graphActions.addElement(data)),
    updateLiveElement: (data: Payload.UpdateElementPayload<NodePen.ElementType>) =>
      dispatch(graphActions.updateLiveElement(data)),
    deleteElement: (id: string) => dispatch(graphActions.deleteElement(id)),
    moveElement: (id: string, position: [number, number]) => dispatch(graphActions.moveElement({ id, position })),
    connect: (data: Payload.ConnectElementsPayload) => dispatch(graphActions.connect(data)),
    prepareLiveMotion: (elementId: string) => dispatch(graphActions.prepareLiveMotion(elementId)),
    dispatchLiveMotion: (dx: number, dy: number) => dispatch(graphActions.dispatchLiveMotion([dx, dy])),
    startLiveWires: (data: Payload.StartLiveWiresPayload) => dispatch(graphActions.startLiveWires(data)),
    updateLiveWires: (x: number, y: number) => dispatch(graphActions.updateLiveWires([x, y])),
    captureLiveWires: (data: Payload.CaptureLiveWiresPayload) => dispatch(graphActions.captureLiveWires(data)),
    releaseLiveWires: () => dispatch(graphActions.releaseLiveWires()),
    endLiveWires: (mode: WireMode | 'cancel') => dispatch(graphActions.endLiveWires(mode)),
    setProvisionalWire: (data: Payload.ProvisionalWirePayload) => dispatch(graphActions.setProvisionalWire(data)),
    clearProvisionalWire: () => dispatch(graphActions.clearProvisionalWire()),
    setMode: (mode: GraphMode) => dispatch(graphActions.setMode(mode)),
    registerElement: (data: Payload.RegisterElementPayload) => dispatch(graphActions.registerElement(data)),
    registerElementAnchor: (data: Payload.RegisterElementAnchorPayload) =>
      dispatch(graphActions.registerElementAnchor(data)),
  }
}
