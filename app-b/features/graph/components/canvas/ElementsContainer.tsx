import React, { useEffect } from 'react'
import { assert, NodePen } from 'glib'
import { useGraphElements } from '../../store/graph/hooks'
import { StaticComponent, Wire } from './elements'
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
          case 'wire': {
            if (!assert.element.isWire(el)) {
              return null
            }

            const { from, to } = el.template

            const fromElement = graph[from.elementId] as NodePen.Element<'static-component'>
            const toElement = graph[to.elementId] as NodePen.Element<'static-component'>

            return <Wire wire={el} from={fromElement} to={toElement} />
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
