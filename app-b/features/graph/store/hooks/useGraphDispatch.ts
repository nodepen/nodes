import { NodePen } from 'glib'
import { useAppDispatch } from '$'
import { graphActions } from '../graphSlice'
import { Payload } from '../types'
import { ActionCreators } from 'redux-undo'

export const useGraphDispatch = () => {
  const dispatch = useAppDispatch()

  return {
    addElement: (data: Payload.AddElementPayload<NodePen.ElementType>) => dispatch(graphActions.addElement(data)),
    moveElement: (id: string, position: [number, number]) => dispatch(graphActions.moveElement({ id, position })),
    undo: () => dispatch(ActionCreators.undo()),
    redo: () => dispatch(ActionCreators.redo()),
  }
}
