import { useState, useLayoutEffect, useEffect, useRef, useMemo } from 'react'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'

const Home = (): React.ReactElement => {
  const [[dx, dy], setPosition] = useState<[number, number]>([0, 0])
  const [scale, setScale] = useState(1)
  const [ready, setReady] = useState(false)

  const canvasRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!canvasRef.current) {
      return
    }

    const canvas = canvasRef.current

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
          options={{ limitToWrapper: false, limitToBounds: false, centerContent: false }}
          onPanning={(x: any) => {
            setPosition([x.positionX, x.positionY])
          }}
          onZoomChange={(zoom: any) => {
            setScale(zoom.scale)
            setPosition([zoom.positionX, zoom.positionY])
          }}
        >
          <></>
          <TransformComponent>
            <div style={{ width: w, height: h }}>
              <div className="w-16 h-16 bg-red-500" />
            </div>
          </TransformComponent>
        </TransformWrapper>
      </div>
    ),
    [w, h]
  )

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
            backgroundSize: `${25 * scale}px ${25 * scale}px`,
            backgroundPosition: `${dx % (25 * scale)}px ${dy % (25 * scale)}px`,
            backgroundImage: `linear-gradient(to right, #98e2c6 ${
              0.3 * scale
            }mm, transparent 1px, transparent 10px), linear-gradient(to bottom, #98e2c6 ${
              0.3 * scale
            }mm, transparent 1px, transparent 10px)`,
          }}
          onContextMenu={(e) => {
            e.preventDefault()
          }}
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
