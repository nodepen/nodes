import React from 'react'
import { NodePen, Grasshopper } from 'glib'
import { CurveGeometry, LineGeometry, PointGeometry, RectangleGeometry } from '../geometry'
import { useVisibleGeometry } from '../../hooks'
import { useGraphSelection } from '@/features/graph/store/graph/hooks'

type GeometryParameterProps = {
  element: NodePen.Element<'static-component'>
  parameter: Grasshopper.Parameter
  parameterId: string
}

export const GeometryParameter = ({ element, parameterId }: GeometryParameterProps): React.ReactElement => {
  const goo = useVisibleGeometry(element, parameterId, ['line', 'point', 'curve', 'circle', 'rectangle'])

  const selection = useGraphSelection()
  const isSelected = selection.includes(element.id)

  return (
    <>
      {goo.map((goo, i) => {
        switch (goo.type) {
          case 'circle':
          case 'curve': {
            const curve = goo as NodePen.DataTreeValue<'curve'>

            return (
              <CurveGeometry
                key={`scene-geometry-${element.id}-${parameterId}-${i}`}
                curve={curve.geometry}
                material={{ color: isSelected ? 'darkgreen' : undefined }}
              />
            )
          }
          case 'line': {
            const line = goo.value as NodePen.GH.Line

            return (
              <LineGeometry
                key={`scene-geometry-${element.id}-${parameterId}-${i}`}
                line={line}
                material={{ color: isSelected ? 'darkgreen' : undefined }}
              />
            )
          }
          case 'point': {
            const point = goo.value as NodePen.GH.Point

            return (
              <PointGeometry
                key={`scene-geometry-${element.id}-${parameterId}-${i}`}
                point={point}
                material={{ color: isSelected ? 'darkgreen' : undefined }}
              />
            )
          }
          case 'rectangle': {
            const rectangle = goo.value as NodePen.GH.Rectangle

            return (
              <RectangleGeometry
                key={`scene-geometry-${element.id}-${parameterId}-${i}`}
                rectangle={rectangle}
                material={{ color: isSelected ? 'darkgreen' : undefined }}
              />
            )
          }
          default: {
            console.log(`🐍 Generic geometry parameter could not visualize type '${(goo as any).type}'`)
          }
        }
      })}
    </>
  )
}
