import React from 'react'
import { NodePen, Grasshopper } from 'glib'
import { CurveGeometry } from '../geometry'
import { useVisibleGeometry } from '../../hooks'
import { useGraphSelection } from '@/features/graph/store/graph/hooks'

type CurveParameterProps = {
  element: NodePen.Element<'static-component'>
  parameter: Grasshopper.Parameter
  parameterId: string
}

export const CurveParameter = ({ element, parameterId }: CurveParameterProps): React.ReactElement => {
  const goo = useVisibleGeometry(element, parameterId, ['curve'])

  const selection = useGraphSelection()
  const isSelected = selection.includes(element.id)

  return (
    <>
      {goo.map((curve, i) => (
        <CurveGeometry
          key={`scene-geometry-${element.id}-${parameterId}-${i}`}
          curve={curve.value}
          material={{ color: isSelected ? 'darkgreen' : undefined }}
        />
      ))}
    </>
  )
}
