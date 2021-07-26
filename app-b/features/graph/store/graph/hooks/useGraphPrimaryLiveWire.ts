import { useAppSelector } from '$'
import { graphSelectors } from '../graphSlice'

export const useGraphPrimaryLiveWire = (): ReturnType<typeof graphSelectors['selectPrimaryWire']> => {
  return useAppSelector(graphSelectors.selectPrimaryWire)
}
