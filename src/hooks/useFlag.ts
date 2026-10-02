import type * as NodePen from '@/types'
import { useStore } from '$'

export const useFlag = (key: keyof NodePen.AppFlags): boolean => {
    return useStore((state) => state.app.flags[key] ?? false)
}