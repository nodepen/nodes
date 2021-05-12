import { useState, useLayoutEffect, useEffect, useRef, useMemo } from 'react'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'

const Home = (): React.ReactElement => {
  const [[dx, dy], setPosition] = useState<[number, number]>([0, 0])
  const [ready, setReady] = useState(false)

  const canvasRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!canvasRef.current) {
      return
    }

    const canvas = canvasRef.current

    setPosition([canvas.clientWidth / 2, canvas.clientHeight / 2])
    setReady(true)
  }, [])

  const [w, h] = useMemo(
    () => (!ready ? [0, 0] : [canvasRef.current?.clientWidth ?? 0, canvasRef.current?.clientHeight ?? 0]),
    [canvasRef, ready]
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
            backgroundSize: '25px 25px',
            backgroundPosition: `${dx % 25}px ${dy % 25}px`,
            backgroundImage:
              'linear-gradient(to right, #98e2c6 0.3mm, transparent 1px, transparent 10px), linear-gradient(to bottom, #98e2c6 0.3mm, transparent 1px, transparent 10px)',
          }}
          onContextMenu={(e) => {
            e.preventDefault()
          }}
        >
          {ready ? (
            <div className="w-full h-full absolute overflow-visible">
              <TransformWrapper
                defaultScale={1}
                defaultPositionX={w / 2}
                defaultPositionY={h / 2}
                options={{ limitToWrapper: false, limitToBounds: false, centerContent: false }}
                onPanning={(x: any) => {
                  setPosition([x.positionX, x.positionY])
                }}
              >
                <TransformComponent>
                  <div style={{ width: w, height: h }}>
                    <div className="w-16 h-16 bg-red-500" />
                  </div>
                </TransformComponent>
              </TransformWrapper>
            </div>
          ) : null}
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
