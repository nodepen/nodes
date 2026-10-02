import type * as NodePen from '@/types'

export const CLUSTER_TEMPLATE: Omit<NodePen.NodeTemplate, 'inputs' | 'outputs'> = {
    guid: 'cluster',
    name: 'Cluster',
    nickName: 'John Cluster',
    description: 'Script in a script innit',
    keywords: [],
    libraryName: 'NodePen',
    category: 'Nodes',
    subcategory: 'Cluster',
    isObsolete: false,
    toggles: []
}
