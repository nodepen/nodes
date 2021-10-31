import React from 'react'
import { NodePen } from 'glib'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { PointGeometry } from './components/geometry'
import { useSceneDispatch } from '../../store/scene/hooks'

const SceneContainer = (): React.ReactElement => {
  const { setDisplayMode } = useSceneDispatch()

  return (
    <div className="w-full h-full flex flex-col justify-start items-center">
      <div className="w-full h-12 flex justify-start items-center bg-none pointer-events-none">
        <div className="h-12 flex-grow bg-green" />
        <button
          className="w-12 h-12 flex justify-center items-center pointer-events-auto"
          onClick={() => setDisplayMode('hide')}
        >
          <svg className="w-6 h-6" fill="#093824" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      <div className="w-full flex-grow bg-pale pointer-events-auto">
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
