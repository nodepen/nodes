import React, { useMemo } from 'react'
import { Canvas } from 'react-three-fiber'
import { OrthographicCamera, OrbitControls, Sphere, Line } from '@react-three/drei'
import { Vector3 } from 'three'

type PanelSceneProps = {
  points: { x: number; y: number; z: number }[]
}

export const PanelScene: React.FunctionComponent<PanelSceneProps> = ({ points }) => {
  const Scene = useMemo(() => {
    return (
      <Canvas camera={{ position: new Vector3(2, 2, 2) }}>
        <OrthographicCamera />
        <OrbitControls />
        <Line
          points={[
            [0, 0, 0],
            [1, 0, 0],
          ]}
          color="red"
        />
        <Line
          points={[
            [0, 0, 0],
            [0, 1, 0],
          ]}
          color="blue"
        />
        <Line
          points={[
            [0, 0, 0],
            [0, 0, 1],
          ]}
          color="green"
        />
        {points.map(({ x, y, z }, i) => {
          return (
            <Sphere key={`shape-${i}`} position={[x, y, z]} scale={new Vector3(0.03, 0.03, 0.03)}>
              <meshBasicMaterial attach="material" color="black" />
            </Sphere>
          )
        })}
      </Canvas>
    )
  }, [points])

  return Scene
}

export default PanelScene
