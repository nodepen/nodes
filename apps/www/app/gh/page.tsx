import NodesAppContainer from "@/components/editor/GraphEditor";
import type * as NodePen from '@nodepen/core'

export default function Page() {
  const document: NodePen.Document = {
    id: '',
    version: 1,
    nodes: {},
    configuration: {
      inputs: [],
      outputs: []
    }
  }

  const templates: NodePen.NodeTemplate[] = [
    {
      guid: 'abc',
      name: 'Series',
      nickName: 'Series',
      description: 'A series of things',
      keywords: [],
      libraryName: 'Core',
      category: 'Numerics',
      subcategory: 'Sets',
      isObsolete: false,
      inputs: [
        {
          __order: 0,
          __direction: 'input',
          name: 'Number',
          nickName: 'N',
          description: 'Number of items',
          typeName: 'integer',
          keywords: [],
          isOptional: false
        }
      ],
      outputs: [
        {
          __order: 0,
          __direction: 'output',
          name: 'Number',
          nickName: 'S',
          description: 'Number of items',
          typeName: 'integer',
          keywords: [],
          isOptional: false
        }
      ]
    }
  ]

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <NodesAppContainer document={document} templates={templates} />
    </div>
  )
}