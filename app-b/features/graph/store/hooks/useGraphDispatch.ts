import { useAppDispatch } from '$'
import { graphActions } from '../graphSlice'

export const useGraphDispatch = () => {
  const dispatch = useAppDispatch()

  return {
    moveElement: (id: string, position: [number, number]) => dispatch(graphActions.moveElement({ id, position })),
  }
}
