import React, { useEffect, useRef } from 'react'
import { Glasshopper } from 'glib'
import { useGraphManager } from '@/context/graph'
import { StaticComponent } from '../elements'

export const GraphCanvas = (): React.ReactElement => {
  const { store: { elements, camera }, dispatch } = useGraphManager()

  const canvasRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    dispatch({ type: 'graph/register-camera', ref: canvasRef })
  }, [])

  const [dx, dy] = camera.position

  return (
    <div ref={canvasRef} className="w-full flex-grow bg-pale z-0 overflow-visible relative">
      <div id="element-container" className="w-full h-full relative overflow-visible border-darkgreen border-2" style={{ transform: `translate(${-dx}px, ${-dy}px)`, left: canvasRef.current.clientWidth / 2, top: canvasRef.current.clientHeight / 2 }}>
        {Object.values(elements).map((element) => {
          switch (element.template.type) {
            case 'static-component': {
              return <StaticComponent key={`el-${element.id}`} instanceId={element.id} />
            }
          }
        })}
      </div>
    </div>
  )
}