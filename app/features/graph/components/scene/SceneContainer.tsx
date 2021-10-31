import React from 'react'
import { ReactReduxContext } from 'react-redux'
import { Canvas, extend } from '@react-three/fiber'
import { OrbitControls, useContextBridge } from '@react-three/drei'
import { SceneGrid } from './SceneGrid'
import { ScenePortal } from './ScenePortal'
import SceneElements from './SceneElements'
import { SceneEnvironment } from './SceneEnvironment'
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial'
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry'
import { Line2 } from 'three/examples/jsm/lines/Line2'

extend({ LineMaterial, LineGeometry, Line2 })

const SceneContainer = (): React.ReactElement => {
  const ReduxBridge = useContextBridge(ReactReduxContext)

  return (
    <ScenePortal>
      <div className="w-full h-full bg-pale pointer-events-auto">
        <Canvas orthographic camera={{ up: [0, 0, 1], zoom: 15, position: [0, 0, 20], near: -50 }}>
          <ReduxBridge>
            <OrbitControls />
            <SceneEnvironment />
            <SceneGrid />
            <SceneElements />
          </ReduxBridge>
        </Canvas>
      </div>
    </ScenePortal>
  )
}

export default React.memo(SceneContainer)
