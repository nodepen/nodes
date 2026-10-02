import type * as NodePen from '@/types'

export const getIconAsImage = (template: NodePen.NodeTemplate): string => {
  return `data:image/png;base64,${template.icon}`
}
