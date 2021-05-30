import { NodePen } from 'glib'
import { useCameraStaticZoom, useCameraMode, useGraphDispatch, useCameraDispatch } from '../../../store/hooks'
import React, { useEffect, useRef } from 'react'
import Draggable from 'react-draggable'
import { useElementDimensions, useCriteria } from 'hooks'
import { useSetCameraPosition } from '@/features/graph/hooks/useSetCameraPosition'

type StaticComponentProps = {
  element: NodePen.Element<'static-component'>
}

const StaticComponent = ({ element }: StaticComponentProps): React.ReactElement | null => {
  const { template, current, id } = element
  console.log(`Render in ${element.id} !`)

  const [x, y] = current.position

  const scale = useCameraStaticZoom()
  const mode = useCameraMode()

  const { moveElement } = useGraphDispatch()
  const { setZoomLock } = useCameraDispatch()

  const componentRef = useRef<HTMLDivElement>(null)

  const { width, height } = useElementDimensions(componentRef)

  const isMoved = useRef(false)
  const isVisible = useCriteria(width, height)

  useEffect(() => {
    if (isMoved.current || !width || !height) {
      return
    }
    console.log('OK')
    isMoved.current = true
    moveElement(id, [x - width / 2, y - height / 2])
  }, [width, height])

  const setCameraPosition = useSetCameraPosition()

  return (
    <div className="w-full h-full pointer-events-none absolute left-0 top-0">
      <Draggable
        scale={scale}
        position={{ x, y }}
        onStart={(e) => {
          e.stopPropagation()
          setZoomLock(true)
        }}
        onStop={(_, e) => {
          const { x, y } = e
          moveElement(element.id, [x, y])
          setZoomLock(false)
          console.log({ x, y })
        }}
        disabled={scale < 0.5 || mode !== 'idle'}
      >
        <div
          className={`${
            isVisible ? 'opacity-100' : 'opacity-0'
          } relative flex flex-row items-stretch pointer-events-auto`}
        >
          <div
            className="absolute w-8 h-4 flex justify-center overflow-visible z-30"
            style={{ top: '-1.2rem', right: '1rem' }}
          >
            {/* <Loading visible={status === 'waiting'} /> */}
          </div>
          <div
            id="input-grips-container"
            className="flex flex-col z-20"
            style={{ paddingTop: '2px', paddingBottom: '2px' }}
          >
            {/* {Object.keys(current.inputs).map((parameterId) => (
                <div
                  key={`input-grip-${parameterId}`}
                  className="w-4 flex-grow flex flex-col justify-center"
                  style={{ transform: 'translateX(50%)' }}
                >
                  {ready ? <Grip source={{ element: id, parameter: parameterId }} /> : null}
                </div>
              ))} */}
          </div>
          <div
            id="panel-container"
            ref={componentRef}
            className="flex flex-row items-stretch rounded-md border-2 border-dark bg-light shadow-osm z-30"
          >
            <div id="inputs-column" className="flex flex-col">
              {/* {Object.entries(current.inputs).map(([parameterId, i]) => (
                  <ComponentParameter
                    key={`input-${parameterId}-${i}`}
                    source={{ element: id, parameter: parameterId }}
                    mode="input"
                  />
                ))} */}
            </div>
            <div
              id="label-column"
              className="w-10 m-1 p-2 rounded-md border-2 border-dark flex flex-col justify-center items-center transition-colors duration-150"
              style={{ background: '#FFF' }}
              onClick={() => setCameraPosition(-x, -y)}
            >
              <div
                className="font-panel text-v font-bold text-sm select-none"
                style={{ writingMode: 'vertical-lr', textOrientation: 'sideways', transform: 'rotate(180deg)' }}
              >
                {template?.nickname.toUpperCase()}
              </div>
            </div>
            <div id="outputs-column" className="flex flex-col">
              {/* {Object.entries(current.outputs).map(([parameterId, i]) => (
                  <ComponentParameter
                    key={`output-${parameterId}-${i}`}
                    source={{ element: id, parameter: parameterId }}
                    mode="output"
                  />
                ))} */}
            </div>
          </div>
          <div
            id="output-grips-container"
            className="flex flex-col z-20"
            style={{ paddingTop: '2px', paddingBottom: '2px' }}
          >
            {/* {Object.keys(current.outputs).map((parameterId) => (
                <div
                  key={`output-grip-${parameterId}`}
                  className="w-4 flex-grow flex flex-col justify-center"
                  style={{ transform: 'translateX(-50%)' }}
                >
                  {ready ? <Grip source={{ element: id, parameter: parameterId }} /> : null}
                </div>
              ))} */}
          </div>
        </div>
      </Draggable>
    </div>
  )
}

export default React.memo(StaticComponent)
