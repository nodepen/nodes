import React from 'react'
import { NodePen, Grasshopper } from 'glib'
import { RectangleGeometry } from '../geometry'
import { useVisibleGeometry } from '../../hooks'
import { useGraphSelection } from '@/features/graph/store/graph/hooks'

type RectangleParameterProps = {
  element: NodePen.Element<'static-component'>
  parameter: Grasshopper.Parameter
  parameterId: string
}

export const RectangleParameter = ({ element, parameterId }: RectangleParameterProps): React.ReactElement => {
  const goo = useVisibleGeometry(element, parameterId, ['rectangle'])

  const selection = useGraphSelection()
  const isSelected = selection.includes(element.id)

  return (
    <>
      {goo.map((rectangle, i) => (
        <RectangleGeometry
          key={`scene-geometry-${element.id}-${parameterId}-${i}`}
          rectangle={rectangle.value}
          material={{ color: isSelected ? 'darkgreen' : undefined }}
        />
      ))}
    </>
  )
}
