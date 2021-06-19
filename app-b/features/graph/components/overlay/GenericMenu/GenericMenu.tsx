import { useEffect, useMemo, useState } from 'react'
import { MenuAction } from 'features/graph/types'

type GenericMenuProps<T> = {
  context: T
  actions: MenuAction<T>[]
}

export const GenericMenu = <T,>({ context, actions }: GenericMenuProps<T>): React.ReactElement => {
  const r = 75

  const [positions, setPositions] = useState<{ [key: number]: { dx: number; dy: number } }>({})

  useEffect(() => {
    setTimeout(() => {
      setPositions(
        actions.reduce((all, action) => {
          const { position } = action

          const radians = position * (Math.PI / 180)
          const [x, y] = [Math.cos(radians), Math.sin(radians)]

          return { ...all, [position]: { dx: x * (r + 24), dy: y * (r + 24) } }
        }, {})
      )
    }, 0)
  }, [])

  const mask = useMemo(
    () => (
      <div
        className="absolute left-0 top-0 overflow-visible"
        style={{ width: 50, height: 50, transform: 'translate(-25px, -25px)' }}
      >
        <svg width="50" height="50" viewBox="0 0 10 10" className="overflow-visible">
          <mask id="donut">
            <circle cx="5" cy="5" r="500" fill="white" />
            <circle className="donut-inner" cx="5" cy="5" r={r / 5} fill="black" />
          </mask>
          <circle className="donut-outer" cx="5" cy="5" r="500" fill="#98E2C6" mask="url(#donut)" />
        </svg>
        <style jsx>{`
          @keyframes grow {
            from {
              transform: scale(0);
            }
          }

          @keyframes growr {
            from {
              r: 0;
            }
          }

          circle {
            transform-origin: 50% 50%;
          }

          .donut-inner {
            animation-name: grow;
            animation-duration: 200ms;
            animation-fill-mode: forwards;
            animation-timing-function: ease-in;
          }

          .donut-outer {
            animation-name: growr;
            animation-duration: 450ms;
            animation-fill-mode: forwards;
            animation-timing-function: cubic-bezier(0.47, 0, 0.745, 0.715);
          }
        `}</style>
      </div>
    ),
    []
  )

  return (
    <>
      {mask}
      {actions.map((action, i) => {
        const { position, label, icon } = action
        const { dx, dy } = positions?.[position] ?? { dx: 0, dy: 0 }

        return (
          <button
            key={`transient-action-${i}-${position}`}
            className="absolute action left-0 top-0 w-12 h-12 rounded-full bg-pale border-2 border-green z-10 transition-transform duration-200 ease-in-out"
            style={{ transform: `translate(${-24 + dx}px, ${-24 + dy}px)` }}
          ></button>
        )
      })}
      <style jsx>{`
        @keyframes appear {
          0% {
            opacity: 0;
          }
          75% {
            opacity: 0;
          }
          100% {
            opacity: 100;
          }
        }

        button {
          animation-name: appear;
          animation-duration: 200ms;
          animation-fill-mode: forwards;
          animation-timing-function: ease-in-out;
        }
      `}</style>
    </>
  )
}
