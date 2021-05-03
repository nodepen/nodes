import { React } from '@ungap/global-this'
import { Glasshopper } from 'glib'
import { Vector3 } from 'three'

type LineProps = {
  line: Glasshopper.Geometry.Line
  material?: {
    color?: string
    width?: number
  }
}

export const LineGeometry = ({ line, material }: LineProps): React.ReactElement => {
  const { start, end } = line

  const points: Vector3[] = [new Vector3(start.x, start.z, -start.y), new Vector3(end.x, end.z, -end.y)]

  return (
    <mesh>
      {/* @ts-expect-error */}
      <meshLine attach="geometry" vertices={points} />
      {/* @ts-expect-error */}
      <meshLineMaterial
        attach="material"
        depthTest={false}
        lineWidth={material?.width ?? 0.06}
        color={material?.color ?? 'darkred'}
      />
    </mesh>
  )
}
