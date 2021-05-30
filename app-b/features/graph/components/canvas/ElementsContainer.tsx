import React, { useEffect } from 'react'
import { assert } from 'glib'
import { useGraphElements, useGraphDispatch, useCameraDispatch, useCameraPosition } from '../../store/hooks'
import { StaticComponent } from './elements'

type ElementsContainerProps = {
  setTransform: (
    positionX: number,
    positionY: number,
    scale: number,
    animationTime: number,
    animationType: string
  ) => void
}

const ElementsContainer = ({ setTransform }: ElementsContainerProps): React.ReactElement => {
  const elements = useGraphElements()

  const [x, y] = useCameraPosition()
  const { setPosition } = useCameraDispatch()

  useEffect(() => {
    setTimeout(() => {
      console.log('moving!')
      console.log(setTransform)
      setTransform(x + 35, y + 35, 1, 150, 'easeInOutQuad')
      setPosition([x + 35, y + 35])
    }, 5000)
  }, [])

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
