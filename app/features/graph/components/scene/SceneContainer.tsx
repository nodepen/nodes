import React from 'react'
import { NodePen } from 'glib'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { PointGeometry } from './components/geometry'
import { ScenePortal } from './ScenePortal'

const SceneContainer = (): React.ReactElement => {
  return (
    <ScenePortal>
      <div className="w-full h-full bg-pale pointer-events-auto">
        <Canvas orthographic camera={{ up: [0, 0, 1], zoom: 50, position: [0, 20, 0], near: -5 }}>
          <OrbitControls />
          <ambientLight />
          <PointGeometry point={{ x: 0, y: 0, z: 0 }} />
        </Canvas>
      </div>
    </ScenePortal>
  )
}

export default React.memo(SceneContainer)
