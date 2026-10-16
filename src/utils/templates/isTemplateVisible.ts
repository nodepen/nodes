import type * as NodePen from '@/types'

// Some templates in the library should be available but not visible
export const isTemplateVisible = (template: NodePen.NodeTemplate): boolean => {
    return !template.isObsolete && !template.isHidden
}
