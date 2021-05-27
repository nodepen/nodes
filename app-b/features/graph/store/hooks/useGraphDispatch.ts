import { NodePen } from 'glib'
import { useAppDispatch } from '$'
import { graphActions } from '../graphSlice'
import { Payload } from '../types'

export const useGraphDispatch = () => {
  const dispatch = useAppDispatch()

  return {
    addElement: (data: Payload.AddElementPayload<NodePen.ElementType>) => dispatch(graphActions.addElement(data)),
    moveElement: (id: string, position: [number, number]) => dispatch(graphActions.moveElement({ id, position })),
  }
}
