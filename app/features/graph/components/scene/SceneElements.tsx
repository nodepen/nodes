import React from 'react'
import { assert } from 'glib'
import { useGraphElements } from '../../store/graph/hooks'
import { StaticComponent } from './components/elements'

const SceneElements = (): React.ReactElement => {
  const graph = useGraphElements()
  const elements = Object.values(graph)

  return (
    <>
      {elements.map((element) => {
        switch (element.template.type) {
          case 'static-component': {
            if (!assert.element.isStaticComponent(element)) {
              return null
            }

            return <StaticComponent key={`scene-element-static-component-${element.id}`} element={element} />
          }
          default: {
            return null
          }
        }
      })}
    </>
  )
}

export default React.memo(SceneElements)
