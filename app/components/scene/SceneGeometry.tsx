import React, { useCallback } from 'react'
import { extend } from '@react-three/fiber'
import * as MeshLine from 'threejs-meshline'
import { Glasshopper } from 'glib'
import { DrawMode, SceneElementId as Id } from './lib/types'
import * as Geometry from './lib/geometry'

type SceneProps = {
  config: {
    draw: DrawMode
  }
  elements: { [key: string]: Glasshopper.Element.Base }
  selection: string[]
  children?: JSX.Element
}

extend(MeshLine)

const SceneGeometry = ({ config, elements, selection }: SceneProps): React.ReactElement => {
  const getElementTrees = useCallback((element: Glasshopper.Element.Base): [string, Glasshopper.Data.DataTree][] => {
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
  }, [])

  const elementsToValues = useCallback((elements: Glasshopper.Element.Base[]): [
    Id,
    Glasshopper.Data.DataTreeValue<Glasshopper.Data.ValueType>
  ][] => {
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
  }, [])

  const idToKey = useCallback((id: Id): string => {
    const { element, parameter, branch, index } = id
    return `scene-${element}-${parameter}-${branch}-${index}`
  }, [])

  return (
    <>
      {elementsToValues(Object.values(elements)).map(([id, value]) => {
        const selected = selection.includes(id.element)

        switch (value.type) {
          case 'point': {
            const { data } = value as Glasshopper.Data.DataTreeValue<'point'>

            const material = {
              size: 0.5,
              color: selected ? 'green' : 'darkred',
              opacity: config.draw === 'selection' ? (selected ? 0.6 : 0) : 0.6,
            }

            return <Geometry.Point key={idToKey(id)} point={data} material={material} />
          }
          case 'curve': {
            const { data } = value as Glasshopper.Data.DataTreeValue<'curve'>

            const material = {
              size: 0.1,
              color: selected ? 'green' : 'darkred',
              opacity: config.draw === 'selection' ? (selected ? 0.9 : 0) : 0.9,
            }

            return <Geometry.Curve key={idToKey(id)} curve={data} material={material} />
          }
          case 'line': {
            const { data } = value as Glasshopper.Data.DataTreeValue<'line'>

            const material = {
              size: 0.1,
              color: selected ? 'green' : 'darkred',
              opacity: config.draw === 'selection' ? (selected ? 0.9 : 0) : 0.9,
            }

            return <Geometry.Line key={idToKey(id)} line={data} material={material} />
          }
          default: {
            return null
          }
        }
      })}
    </>
  )
}

export default SceneGeometry
