import React from 'react'
import { Glasshopper } from 'glib'
import { useGraphManager } from '@/context/graph'

export const GraphCanvas = (): React.ReactElement => {
  const { store: { elements } } = useGraphManager()

  return (
    <div className="w-full flex-grow bg-pale">
      {Object.values(elements).map((element: Glasshopper.Element.StaticComponent) => (
        <h2 className="block font-panel text-base" >
          {`${element.template.name} [${element.current.position[0]}, ${element.current.position[1]}] (${element.id})`}
        </h2>
      ))}
    </div>
  )
}