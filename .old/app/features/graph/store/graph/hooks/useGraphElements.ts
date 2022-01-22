import { useAppSelector } from '$'
import { graphSelectors } from '../graphSlice'

export const useGraphElements = (): ReturnType<typeof graphSelectors['selectElements']> => {
  return useAppSelector(graphSelectors.selectElements)
}
