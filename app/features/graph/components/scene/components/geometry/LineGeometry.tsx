import React, { useLayoutEffect, useRef } from 'react'
import { NodePen } from 'glib'
import { MeshMaterial } from '../../types'
import { Line2 } from '@react-three/drei'
import { Vector3 } from 'three'

type LineGeometryProps = {
  line: NodePen.GH.Line
  material: MeshMaterial
}

export const LineGeometry = ({ line, material }: LineGeometryProps): React.ReactElement => {
  const { color, opacity } = material

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

  const lineRef = useRef<any>(null)

  useLayoutEffect(() => {
    const { from: f, to: t } = line

    lineRef.current?.setPositions([f.x, f.y, f.z, t.x, t.y, t.z])
  }, [line])

  return (
    <>
      {/* @ts-expect-error `line2` does not publish types */}
      <line2>
        {/* @ts-expect-error `line2` does not publish types */}
        <lineGeometry ref={lineRef} />
        {/* @ts-expect-error `line2` does not publish types */}
        <lineMaterial color={color ?? 'green'} linewidth={0.0005} resolution={[1, 1]} />
        {/* @ts-expect-error `line2` does not publish types */}
      </line2>
    </>
  )
}
