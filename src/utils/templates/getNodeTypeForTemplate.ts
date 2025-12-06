import type * as NodePen from '@/types'

type NodePenNodeType = 'generic-node' | 'generic-parameter' | 'unknown'

export const getNodeTypeForTemplate = (template?: NodePen.NodeTemplate): NodePenNodeType => {
  if (!template) {
    return 'unknown'
  }

  switch (template.category.toLowerCase()) {
    case 'params': {
      return 'generic-parameter'
    }
    default: {
      return 'generic-node'
    }
  }
}