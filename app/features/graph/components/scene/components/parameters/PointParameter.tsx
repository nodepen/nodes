import React from 'react'
import { NodePen, Grasshopper } from 'glib'
import { PointGeometry } from '../geometry'
import { useVisibleGeometry } from '../../hooks'
import { useGraphSelection } from '@/features/graph/store/graph/hooks'

type PointParameterProps = {
  element: NodePen.Element<'static-component'>
  parameter: Grasshopper.Parameter
  parameterId: string
}

export const PointParameter = ({ element, parameterId }: PointParameterProps): React.ReactElement => {
  const goo = useVisibleGeometry(element, parameterId)

  const selection = useGraphSelection()
  const isSelected = selection.includes(element.id)

  return (
    <>
      {goo.map((point, i) => (
        <PointGeometry
          key={`scene-geometry-${element.id}-${parameterId}-${i}`}
          point={point.value}
          material={{ color: isSelected ? 'darkgreen' : undefined }}
        />
      ))}
    </>
  )
}
