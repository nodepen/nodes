import React, { useEffect } from 'react'
import { assert } from 'glib'
import { useGraphElements } from '../../store/graph/hooks'
import { StaticComponent } from './elements'
import { useDebugRender } from 'hooks'

const ElementsContainer = (): React.ReactElement => {
  const graph = useGraphElements()
  const elements = Object.values(graph)

  useDebugRender('ElementsContainer')

  useEffect(() => {
    const printElements = (e: KeyboardEvent): void => {
      switch (e.code) {
        case 'Space': {
          console.log(elements)
        }
      }
    }

    window.addEventListener('keydown', printElements)

    return () => {
      window.removeEventListener('keydown', printElements)
    }
  })

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
