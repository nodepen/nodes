import React from 'react'
import { NodePen, Grasshopper } from 'glib'
import { LineGeometry } from '../geometry'
import { useVisibleGeometry } from '../../hooks'
import { useGraphSelection } from '@/features/graph/store/graph/hooks'

type LineParameterProps = {
  element: NodePen.Element<'static-component'>
  parameter: Grasshopper.Parameter
  parameterId: string
}

export const LineParameter = ({ element, parameterId }: LineParameterProps): React.ReactElement => {
  const goo = useVisibleGeometry(element, parameterId, ['line'])

  const selection = useGraphSelection()
  const isSelected = selection.includes(element.id)

  return (
    <>
      {goo.map((line, i) => (
        <LineGeometry
          key={`scene-geometry-${element.id}-${parameterId}-${i}`}
          line={line.value}
          material={{ color: isSelected ? 'darkgreen' : undefined }}
        />
      ))}
    </>
  )
}
