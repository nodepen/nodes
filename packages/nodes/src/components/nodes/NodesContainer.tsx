import React from 'react'
import type { Element } from '@nodepen/core'
import { useStore } from '$'
import { COLORS } from '@/constants'
import CommonElement from './CommonElement'

const NodesContainer = (): React.ReactElement => {
  // TODO: Pull from state in a smart way
  const elements = useStore((store) => store.document.elements)

  return (
    <g id="np-elements" className="np-pointer-events-auto">
      {Object.entries(elements).map(([elementId, element], i) => {
        // Handle special templates (number slider, panel, etc)
        const { template } = element

        return <CommonElement id={elementId} />
      })}
    </g>
  )
}

export default React.memo(NodesContainer)
