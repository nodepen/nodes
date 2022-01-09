import React, { useState, useEffect } from 'react'

type AuthLayoutProps = {
  children: JSX.Element
}

export const AuthLayout = ({ children }: AuthLayoutProps): React.ReactElement => {
  const [doBounce, setDoBounce] = useState(false)

  const handleToggleBounce = (): void => {
    setDoBounce(true)
    setTimeout(() => {
      setDoBounce(false)
    }, 250)
  }

  useEffect(() => {
    window.addEventListener('keydown', handleToggleBounce)

    return () => {
      window.removeEventListener('keydown', handleToggleBounce)
    }
  })

  const GRID_SPACING = 15

  return (
    <div className="w-vw h-vh relative overflow-hidden">
      <div className={` w-vw h-vh absolute left-0 top-0 z-0 bg-green`}>
        <div className="w-full h-full flex flex-col justify-center items-center">
          <div className={`${doBounce ? 'do-bounce' : ''} w-128 h-128 rounded-full bg-pale`} />
        </div>
      </div>
      <div className="w-vw h-vh absolute left-0 top-0 z-10">
        <div className="w-full h-full flex flex-col justify-center items-center">
          <svg width="750" height="750" className="marcher" viewBox="0 0 750 750">
            {Array(750 / GRID_SPACING)
              .fill('')
              .map((_, i) => {
                const n = i * GRID_SPACING
                return (
                  <>
                    <line
                      x1={n}
                      y1={0}
                      x2={n}
                      y2={750}
                      stroke="#98E2C6"
                      strokeWidth="1px"
                      vectorEffect="non-scaling-stroke"
                    />
                    <line
                      x1={0}
                      y1={n}
                      x2={750}
                      y2={n}
                      stroke="#98E2C6"
                      strokeWidth="1px"
                      vectorEffect="non-scaling-stroke"
                    />
                  </>
                )
              })}
          </svg>
        </div>
      </div>
      <div className="w-vw h-vh absolute left-0 top-0 z-20">
        <div className="w-full h-full flex flex-col justify-center items-center">{children}</div>
      </div>
      <style jsx>{`
        @keyframes bounce {
          0% {
            transform: translateY(0px);
          }
          40% {
            transform: translateY(8px);
          }
          80% {
            transform: translateY(-2px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        .do-bounce {
          animation-name: bounce;
          animation-duration: 250ms;
          animation-timing-function: ease-out;
        }

        @keyframes march {
          from {
            transform: translate(0px, 0px);
          }
          to {
            transform: translate(${GRID_SPACING}px, -${GRID_SPACING}px);
          }
        }

        .marcher {
          animation-name: march;
          animation-duration: 1500ms;
          animation-iteration-count: infinite;
          animation-timing-function: linear;
        }
      `}</style>
    </div>
  )
}
