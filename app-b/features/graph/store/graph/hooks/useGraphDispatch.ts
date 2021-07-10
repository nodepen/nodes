import { NodePen } from 'glib'
import { useAppDispatch } from '$'
import { graphActions } from '../graphSlice'
import { Payload } from '../types'
import { ActionCreators } from 'redux-undo'
import { GraphMode } from '../types/GraphMode'

export const useGraphDispatch = () => {
  const dispatch = useAppDispatch()

  return {
    undo: () => dispatch(ActionCreators.undo()),
    redo: () => dispatch(ActionCreators.redo()),
    addElement: (data: Payload.AddElementPayload<NodePen.ElementType>) => dispatch(graphActions.addElement(data)),
    updateElement: (data: Payload.UpdateElementPayload<NodePen.ElementType>) =>
      dispatch(graphActions.updateElement(data)),
    deleteElement: (id: string) => dispatch(graphActions.deleteElement(id)),
    moveElement: (id: string, position: [number, number]) => dispatch(graphActions.moveElement({ id, position })),
    connect: (data: Payload.ConnectElementsPayload) => dispatch(graphActions.connect(data)),
    prepareLiveMotion: (elementId: string) => dispatch(graphActions.prepareLiveMotion(elementId)),
    dispatchLiveMotion: (dx: number, dy: number) => dispatch(graphActions.dispatchLiveMotion([dx, dy])),
    startLiveWire: (data: Payload.StartLiveWirePayload) => dispatch(graphActions.startLiveWire(data)),
    updateLiveWire: (data: Payload.UpdateLiveWirePayload) => dispatch(graphActions.updateLiveWire(data)),
    captureLiveWire: (data: Payload.CaptureLiveWirePayload) => dispatch(graphActions.captureLiveWire(data)),
    releaseLiveWire: () => dispatch(graphActions.releaseLiveWire()),
    endLiveWire: () => dispatch(graphActions.endLiveWire()),
    setProvisionalWire: (data: Payload.ProvisionalWirePayload) => dispatch(graphActions.setProvisionalWire(data)),
    clearProvisionalWire: () => dispatch(graphActions.clearProvisionalWire()),
    setMode: (mode: GraphMode) => dispatch(graphActions.setMode(mode)),
    registerElement: (data: Payload.RegisterElementPayload) => dispatch(graphActions.registerElement(data)),
    registerElementAnchor: (data: Payload.RegisterElementAnchorPayload) =>
      dispatch(graphActions.registerElementAnchor(data)),
  }
}
