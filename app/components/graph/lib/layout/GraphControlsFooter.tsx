import React, { useState, useMemo } from 'react'
import { Grasshopper } from 'glib'
import { useGraphManager } from '@/context/graph'
import { Draggable } from '../utils'


export const GraphControlsFooter = (): React.ReactElement => {
  const { library } = useGraphManager()

  const [selectedCategory, setSelectedCategory] = useState('params')

  const visibleComponents = Object.values<Grasshopper.Component[]>(library[selectedCategory])

  const capitalize = (string: string): string => {
    return `${string[0].toUpperCase()}${string.substring(1)}`
  }

  const [stagedComponent, setStagedComponent] = useState<Grasshopper.Component>()
  const [start, setStart] = useState<[number, number]>()

  const handleStartPlacement = (e: React.PointerEvent<HTMLButtonElement>, component: Grasshopper.Component): void => {
    const { pageX, pageY } = e
    setStagedComponent(component)
    setStart([pageX, pageY])
  }

  const handlePlacement = (position: [number, number], component: Grasshopper.Component): void => {
    const [x, y] = position
    console.log(`Dropped ${component.name} at ${x},${y}`)
    setStagedComponent(undefined)
    setStart(undefined)
  }

  return (
    <div className="pl-6 pr-6 w-full bg-green flex flex-row">
      <div id="components-container" className="flex-grow flex flex-col overflow-hidden">
        <div className="w-full h-8 flex flex-row items-center">
          {Object.keys(library).map((category) => (
            <button
              key={`cat-${category}`}
              className={`${category === selectedCategory ? 'text-darkgreen font-semibold' : 'text-swampgreen font-normal'} font-sans text-sm mr-4 hover:text-darkgreen`}
              onClick={() => setSelectedCategory(category)}
            >
              {`${capitalize(category)}`}
            </button>
          ))}
        </div>
        <div className="w-full h-12 max-h-full pb-2 flex flex-row items-center overflow-auto">
          {visibleComponents.map((subcategories, i) => (
            <>
              {subcategories.map((component, j) => (
                <button key={`${i}-component-${component.name}`} className={`w-8 min-w-8 h-8 mr-3 rounded-sm border-2 border-green hover:border-swampgreen flex justify-center items-center`} onPointerDown={(e) => handleStartPlacement(e, component)} >
                  <img width="24px" height="24px" draggable="false" src={`data:image/png;base64,${component.icon}`} alt={component.name} />
                </button>
              ))}
              {(i < visibleComponents.length - 1) ? <div key={`div-${i}`} className="h-4 mr-3 inline-block border-r-2 border-swampgreen" /> : null}
            </>
          ))}
        </div>
      </div>
      { stagedComponent && start ? <Draggable start={start} template={stagedComponent} onCancel={() => setStagedComponent(undefined)} onDrop={handlePlacement} /> : null}
      {/* <div id="controls-container" className="w-20 bg-green" /> */}
    </div>
  )
}