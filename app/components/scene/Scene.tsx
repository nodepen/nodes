import React from 'react'
import { Canvas, extend } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as MeshLine from 'threejs-meshline'
import { Glasshopper } from 'glib'
import { useGraphManager } from '@/context/graph'
import { useSceneManager } from './lib/context'
import { SceneElementId as Id } from './lib/types'
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
    <Canvas orthographic camera={{ zoom: 50, position: [0, 20, 0], near: -5 }}>
      <OrbitControls />
      <Grid />
      <>
        {elementsToValues(Object.values(elements)).map(([id, value]) => {
          const selected = selection.includes(id.element)

          switch (value.type) {
            case 'point': {
              const { data } = value as Glasshopper.Data.DataTreeValue<'point'>

              return <Geometry.Point key={idToKey(id)} point={data} selected={selected} />
            }
            case 'curve': {
              const { data } = value as Glasshopper.Data.DataTreeValue<'curve'>

              return <Geometry.Curve key={idToKey(id)} curve={data} />
            }
            case 'line': {
              const { data } = value as Glasshopper.Data.DataTreeValue<'line'>

              return <Geometry.Line key={idToKey(id)} line={data} />
            }
            default: {
              return null
            }
          }
        })}
      </>
      {/* </OrthographicCamera> */}
    </Canvas>
  )
}

export default Scene
