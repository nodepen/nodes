import { useAppSelector } from '$'
import { graphSelectors } from '../graphSlice'

export const useLiveWiresOrigin = (): ReturnType<typeof graphSelectors['selectLiveWiresOrigin']> => {
  return useAppSelector(graphSelectors.selectLiveWiresOrigin)
}
