import React from 'react'
import { assert } from 'glib'
import { useGraphElements } from '../../store/hooks'
import { StaticComponent } from './elements'
import { useDebugRender } from 'hooks'

const ElementsContainer = (): React.ReactElement => {
  const graph = useGraphElements()
  const elements = Object.values(graph)

  useDebugRender('ElementsContainer')

  return (
    <>
      {elements.map((el) => {
        switch (el.template.type) {
          case 'static-component': {
            if (!assert.element.isStaticComponent(el)) {
              return null
            }

            return <StaticComponent key={`graph-element-${el.id}`} element={el} />
          }
          default: {
            return null
          }
        }
      })}
    </>
  )
}

export default React.memo(ElementsContainer)
