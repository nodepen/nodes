import { useFlag } from "./useFlag"

export const useIsEditable = (): boolean => {
    return useFlag('isEditable')
}