import React from 'react'
import { NodePen } from 'glib'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { PointGeometry } from './components/geometry'

const SceneContainer = (): React.ReactElement => {
  return (
    <div className="w-full h-full flex flex-col justify-start items-center">
      <div className="w-full h-12 bg-green" />
      <div className="w-full flex-grow bg-pale">
        <Canvas orthographic camera={{ up: [0, 0, 1], zoom: 50, position: [0, 20, 0], near: -5 }}>
          <OrbitControls />
          <ambientLight />
          <PointGeometry point={{ x: 0, y: 0, z: 0 }} />
        </Canvas>
      </div>
    </div>
  )
}

export default React.memo(SceneContainer)
