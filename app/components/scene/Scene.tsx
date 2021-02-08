import React, { useEffect } from 'react'
import { Canvas } from 'react-three-fiber'
import { OrthographicCamera, OrbitControls } from '@react-three/drei'
import { Glasshopper } from 'glib'
import { useSessionManager } from '@/context/session'
import { useGraphManager } from '@/context/graph'
import { useSceneManager } from './lib/context'
import { SceneElementId as Id } from './lib/types'
import { SceneGrid as Grid } from './SceneGrid'
import * as Geometry from './lib/geometry'
import { useQuery } from '@apollo/client'
import { SESSION_CURRENT_SOLUTION } from '@/queries'

const Scene = (): React.ReactElement => {
  const { session } = useSessionManager()

  const {
    store: { elements },
    dispatch,
  } = useGraphManager()

  const {
    store: { selection },
  } = useSceneManager()

  const { data } = useQuery(SESSION_CURRENT_SOLUTION, { variables: { id: session.id }, pollInterval: 1000 })

  useEffect(() => {
    if (!data) {
      return
    }

    const incoming = data.getSession.current

    if (incoming && incoming !== session.id) {
      console.log('🔔 Detected new solution, updating local reference.')
      dispatch({ type: 'session/declare-solution', id: incoming })
    }
  }, [data])

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
    <Canvas>
      <OrthographicCamera />
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
            default: {
              return null
            }
          }
        })}
      </>
    </Canvas>
  )
}

export default Scene
