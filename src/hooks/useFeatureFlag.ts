import type * as NodePen from '@/types'
import { useStore } from '$'

export const useFeatureFlag = (key: keyof NodePen.AppFeatures): boolean => {
    return useStore((state) => state.app.features[key] ?? false)
}