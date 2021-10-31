import React, { useLayoutEffect, useRef } from 'react'
import { NodePen } from 'glib'
import { MeshMaterial } from '../../types'

type LineGeometryProps = {
  line: NodePen.GH.Line
  material: MeshMaterial & { width?: number }
}

export const LineGeometry = ({ line, material }: LineGeometryProps): React.ReactElement => {
  const { color, width, opacity } = material

  //   <line2
  //   <mesh>
  //     {/* @ts-expect-error `threejs-meshline` does not publish types */}
  //     <meshLine attach="geometry" vertices={[new Vector3(f.x, f.y, f.z), new Vector3(t.x, t.y, t.z)]} />
  //     {/* @ts-expect-error `threejs-meshline` does not publish types */}
  //     <meshLineMaterial
  //       attach="material"
  //       depthTest={false}
  //       lineWidth={0.05}
  //       color={color ?? 'darkred'}
  //       opacity={opacity ?? 1}
  //       transparent={opacity && opacity < 1}
  //     />
  //   </mesh>
  // )

  const lineGeometryRef = useRef<any>(null)
  const lineMaterialRef = useRef<any>(null)

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
        <lineMaterial color={color ?? 'darkred'} linewidth={width ?? 0.5} worldUnits={true} />
        {/* @ts-expect-error `line2` does not publish types */}
      </line2>
    </>
  )
}
