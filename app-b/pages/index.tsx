import React, { useState, useEffect, useRef, useMemo } from 'react'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import Draggable from 'react-draggable'

const Home = (): React.ReactElement => {
  const [[dx, dy], setPosition] = useState<[number, number]>([0, 0])
  const [scale, setScale] = useState(1)
  const [ready, setReady] = useState(false)

  const canvasRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!canvasRef.current) {
      return
    }

    setReady(true)
  }, [])

  const [w, h] = useMemo(
    () => (!ready ? [0, 0] : [canvasRef.current?.clientWidth ?? 0, canvasRef.current?.clientHeight ?? 0]),
    [canvasRef, ready]
  )

  const c = useMemo(
    () => (
      <div className="w-full h-full relative overflow-visible">
        <TransformWrapper
          defaultScale={1}
          defaultPositionX={27}
          defaultPositionY={27}
          options={{ limitToWrapper: false, limitToBounds: false, centerContent: false, minScale: 0.25, maxScale: 2.5 }}
          onPanning={(x: any) => {
            setPosition([x.positionX, x.positionY])
          }}
          onZoomChange={(zoom: any) => {
            setScale(zoom.scale)
            setPosition([zoom.positionX, zoom.positionY])
          }}
          pinch={{ step: 100 }}
          wheel={{ step: 100 }}
          scalePadding={{ disabled: true }}
          pan={{ velocity: false }}
        >
          <></>
          <TransformComponent>
            <div style={{ width: w, height: h }}>
              <Draggable
                scale={scale}
                onStart={(e) => {
                  e.stopPropagation()
                }}
                disabled={scale < 0.5}
              >
                <div className="w-16 h-16 bg-red-500" />
              </Draggable>
            </div>
          </TransformComponent>
        </TransformWrapper>
      </div>
    ),
    [w, h]
  )

  const meta = scale < 0.5 ? 5 : 1

  return (
    <div className="w-vw h-vh bg-pale flex flex-col">
      <div className="w-full h-10 bg-white" />
      <div className="w-full h-12 bg-green" />
      <div className="w-full flex-grow bg-pale" ref={canvasRef}>
        <div
          className={`${
            ready ? 'opacity-100' : 'opacity-0'
          } w-full h-full bg-pale z-0 overflow-hidden relative transition-opacity duration-75`}
          style={{
            backgroundSize: `${25 * scale * meta}px ${25 * scale * meta}px`,
            backgroundPosition: `${dx % (25 * scale * meta)}px ${dy % (25 * scale * meta)}px`,
            backgroundImage: `linear-gradient(to right, #98e2c6 ${
              0.3 * scale
            }mm, transparent 1px, transparent 10px), linear-gradient(to bottom, #98e2c6 ${
              0.3 * scale
            }mm, transparent 1px, transparent 10px)`,
          }}
          onContextMenu={(e) => {
            e.preventDefault()
          }}
          onMouseDown={(e) => {
            switch (e.button) {
              case 2:
                return
              default:
                e.stopPropagation()
            }
          }}
          role="presentation"
        >
          {c}
        </div>

        {/* <div
              className="w-full h-full bg-pale z-0 overflow-hidden relative"
              style={{
                backgroundSize: '25px 25px',
                backgroundPosition: `${-dx % 25}px ${-dy % 25}px`,
                backgroundImage:
                  'linear-gradient(to right, #98e2c6 0.3mm, transparent 1px, transparent 10px), linear-gradient(to bottom, #98e2c6 0.3mm, transparent 1px, transparent 10px)',
              }}
            /> */}
      </div>
    </div>
  )
}

export default Home
