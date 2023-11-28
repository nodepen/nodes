import * as NodePen from '@nodepen/core'

type NodeType = 'generic-node' | 'generic-port' | 'panel'

// TODO: If this library is language-agnostic, it doesn't make sense for "special" components to be
// hard-coded Grasshopper guids. Moot until this supports anything other than grasshopper, but still.

export const getNodeType = (template: NodePen.NodeTemplate): NodeType => {
  switch (template.guid) {
    case '59e0b89a-e487-49f8-bab8-b5bab16be14c': {
      return 'panel'
    }
    default: {
      return 'generic-node'
    }
  }
}
