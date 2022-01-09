import { useAppSelector } from '$'
import { graphSelectors } from '../graphSlice'

export const useGraphAuthor = (): ReturnType<typeof graphSelectors['selectGraphAuthor']> => {
  return useAppSelector(graphSelectors.selectGraphAuthor)
}
