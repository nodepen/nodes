import React, { useState } from 'react'
import { Canvas, extend } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as MeshLine from 'threejs-meshline'
import { Glasshopper } from 'glib'
import { useGraphManager } from '@/context/graph'
import { useSceneManager } from './lib/context'
import { DrawMode, SceneElementId as Id } from './lib/types'
import { SceneGrid as Grid } from './SceneGrid'
import * as Geometry from './lib/geometry'

extend(MeshLine)

const Scene = (): React.ReactElement => {
  const {
    store: { elements },
  } = useGraphManager()

  const {
    store: { selection },
  } = useSceneManager()

  const [mode, setMode] = useState<DrawMode>('default')

  const getElementTrees = (element: Glasshopper.Element.Base): [string, Glasshopper.Data.DataTree][] => {
    switch (element.template.type) {
      case 'static-component': {
        const component = element as Glasshopper.Element.StaticComponent

        return Object.entries(component.current.values)
      }
      case 'static-parameter': {
        const parameter = element as Glasshopper.Element.StaticParameter

        return [['output', parameter.current.values]]
      }
      default: {
        return []
      }
    }
  }

  const elementsToValues = (
    elements: Glasshopper.Element.Base[]
  ): [Id, Glasshopper.Data.DataTreeValue<Glasshopper.Data.ValueType>][] => {
    const results: [Id, Glasshopper.Data.DataTreeValue<Glasshopper.Data.ValueType>][] = []

    elements.forEach((el) => {
      const trees = getElementTrees(el)
      trees.forEach(([parameter, tree]) => {
        Object.entries(tree ?? {}).forEach(([branch, values]) => {
          values.forEach((value, i) => {
            const id: Id = {
              element: el.id,
              parameter: parameter,
              branch: branch,
              index: i,
            }

            results.push([id, value])
          })
        })
      })
    })

    console.log(`Scene has ${results.length} items.`)

    return results
  }

  const idToKey = (id: Id): string => {
    const { element, parameter, branch, index } = id
    return `scene-${element}-${parameter}-${branch}-${index}`
  }

  return (
    <>
      <div className="w-full h-12 p-2 pl-8 pr-8 flex flex-row justify-start items-center bg-green z-10">
        <button
          onClick={() => setMode((current) => (current === 'default' ? 'selection' : 'default'))}
          className={`${
            mode === 'selection' ? 'bg-swampgreen' : ''
          } p-2 h-6 mr-2 rounded-full border-2 border-swampgreen flex flex-row items-center justify-center font-display text-sm`}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          <p className="ml-2 hidden md:block">Only show selected</p>
        </button>
      </div>
      <Canvas orthographic camera={{ zoom: 50, position: [0, 20, 0], near: -5 }} style={{ height: '100%' }}>
        <OrbitControls />
        <Grid />
        <>
          {elementsToValues(Object.values(elements)).map(([id, value]) => {
            const selected = selection.includes(id.element)

            switch (value.type) {
              case 'point': {
                const { data } = value as Glasshopper.Data.DataTreeValue<'point'>

                const material = {
                  size: 0.5,
                  color: selected ? 'green' : 'darkred',
                  opacity: mode === 'selection' ? (selected ? 0.6 : 0) : 0.6,
                }

                return <Geometry.Point key={idToKey(id)} point={data} material={material} />
              }
              case 'curve': {
                const { data } = value as Glasshopper.Data.DataTreeValue<'curve'>

                const material = {
                  size: 0.1,
                  color: selected ? 'green' : 'darkred',
                  opacity: mode === 'selection' ? (selected ? 0.9 : 0) : 0.9,
                }

                return <Geometry.Curve key={idToKey(id)} curve={data} material={material} />
              }
              case 'line': {
                const { data } = value as Glasshopper.Data.DataTreeValue<'line'>

                const material = {
                  size: 0.1,
                  color: selected ? 'green' : 'darkred',
                  opacity: mode === 'selection' ? (selected ? 0.9 : 0) : 0.9,
                }

                return <Geometry.Line key={idToKey(id)} line={data} material={material} />
              }
              default: {
                return null
              }
            }
          })}
        </>
        {/* </OrthographicCamera> */}
      </Canvas>
    </>
  )
}

export default Scene
