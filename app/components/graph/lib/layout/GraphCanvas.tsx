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

  return (
    <div ref={canvasRef} className="w-full flex-grow bg-pale z-0 overflow-visible">
      {Object.values(elements).map((element) => {
        switch (element.template.type) {
          case 'static-component': {
            return <StaticComponent key={`el-${element.id}`} instanceId={element.id} />
          }
        }
      })}
    </div>
  )
}