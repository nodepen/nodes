import React from 'react'
import { NodePen } from 'glib'
import { ReactReduxContext } from 'react-redux'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useContextBridge } from '@react-three/drei'
import { ScenePortal } from './ScenePortal'
import SceneElements from './SceneElements'

const SceneContainer = (): React.ReactElement => {
  const ReduxBridge = useContextBridge(ReactReduxContext)

  return (
    <ScenePortal>
      <div className="w-full h-full bg-pale pointer-events-auto">
        <Canvas orthographic camera={{ up: [0, 0, 1], zoom: 50, position: [0, 0, 20], near: -5 }}>
          <ReduxBridge>
            <OrbitControls />
            <ambientLight />
            <SceneElements />
          </ReduxBridge>
        </Canvas>
      </div>
    </ScenePortal>
  )
}

export default React.memo(SceneContainer)
