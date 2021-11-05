import React, { useLayoutEffect, useRef } from 'react'
import { NodePen } from 'glib'
import { MeshMaterial } from '../../types'

type RectangleGeometryProps = {
  rectangle: NodePen.GH.Rectangle
  material?: MeshMaterial
}

export const RectangleGeometry = ({ rectangle, material }: RectangleGeometryProps): React.ReactElement => {
  const { color, opacity } = material ?? {}

  const lineGeometryRef = useRef<any>(null)

  useLayoutEffect(() => {
    const { a, b, c, d } = rectangle.corners

    lineGeometryRef.current?.setPositions([a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z, d.x, d.y, d.z, a.x, a.y, a.z])
  }, [rectangle])

  return (
    <>
      {/* @ts-expect-error `line2` does not publish types */}
      <line2>
        {/* @ts-expect-error `line2` does not publish types */}
        <lineGeometry ref={lineGeometryRef} />
        {/* @ts-expect-error `line2` does not publish types */}
        <lineMaterial
          color={color ?? 'darkred'}
          linewidth={0.2}
          worldUnits={true}
          opacity={opacity ?? 0.7}
          transparent={true}
        />
        {/* @ts-expect-error `line2` does not publish types */}
      </line2>
    </>
  )
}
