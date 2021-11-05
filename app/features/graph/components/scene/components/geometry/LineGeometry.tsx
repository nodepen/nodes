import React, { useLayoutEffect, useRef } from 'react'
import { NodePen } from 'glib'
import { MeshMaterial } from '../../types'

type LineGeometryProps = {
  line: NodePen.GH.Line
  material?: MeshMaterial & { width?: number }
}

export const LineGeometry = ({ line, material }: LineGeometryProps): React.ReactElement => {
  const { color, width, opacity } = material ?? {}

  const lineGeometryRef = useRef<any>(null)

  useLayoutEffect(() => {
    const { from: f, to: t } = line

    lineGeometryRef.current?.setPositions([f.x, f.y, f.z, t.x, t.y, t.z])
  }, [line])

  // worldUnits={true}

  return (
    <>
      {/* @ts-expect-error `line2` does not publish types */}
      <line2>
        {/* @ts-expect-error `line2` does not publish types */}
        <lineGeometry ref={lineGeometryRef} />
        {/* @ts-expect-error `line2` does not publish types */}
        <lineMaterial
          color={color ?? 'darkred'}
          linewidth={width ?? 0.2}
          worldUnits={true}
          opacity={opacity ?? 0.7}
          transparent={true}
        />
        {/* @ts-expect-error `line2` does not publish types */}
      </line2>
    </>
  )
}
