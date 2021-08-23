import React, { useEffect } from 'react'
import { assert } from 'glib'
import { useGraphElements } from '../../store/graph/hooks'
import { StaticComponent, LiveWire, Annotation, NumberSlider, Wire, SelectionRegion } from './elements'
import { NodePen } from '@/glib/src'

const ElementsContainer = (): React.ReactElement => {
  const graph = useGraphElements()
  const elements = Object.values(graph)

  // useDebugRender('ElementsContainer')

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

            return <StaticComponent key={`graph-element-static-component-${el.id}`} element={el} />
          }
          case 'wire': {
            if (!assert.element.isWire(el)) {
              return null
            }

            switch (el.template.mode) {
              case 'live': {
                return <LiveWire key={`graph-element-wire-${el.id}`} wire={el} />
              }
              default: {
                return <Wire key={`graph-element-wire-${el.id}`} wire={el} />
              }
            }
          }
          case 'region': {
            if (!assert.element.isRegion(el)) {
              return null
            }

            switch (el.template.mode) {
              case 'group': {
                return null
              }
              case 'selection': {
                return <SelectionRegion key={`graph-element-region-${el.id}`} region={el} />
              }
              default: {
                return null
              }
            }
          }
          case 'number-slider': {
            if (!assert.element.isNumberSlider(el)) {
              return null
            }

            return <NumberSlider key={`graph-element-number-slider-${el.id}`} element={el} />
          }
          case 'annotation': {
            const annotation = el as NodePen.Element<'annotation'>

            return <Annotation key={`graph-element-annotation-${el.id}`} annotation={annotation} />
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
