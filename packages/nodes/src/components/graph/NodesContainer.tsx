import React from 'react'
import { useStore } from '$'
import { GenericNode } from './generic-node'

const NodesContainer = (): React.ReactElement => {
  // TODO: Pull from state in a smart way
  const elements = useStore((store) => store.document.elements)

  return (
    <g id="np-nodes" className="np-pointer-events-auto">
      {Object.entries(elements).map(([elementId, element], i) => {
        // Handle special templates (number slider, panel, etc)
        const { template } = element

        switch (template) {
          case 'some-id':
            return null
          default:
            return <GenericNode id={elementId} />
        }
      })}
    </g>
  )
}

export default React.memo(NodesContainer)
