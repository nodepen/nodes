import { MenuAction } from 'features/graph/types'

type GenericMenuProps<T> = {
  context: T
  actions: MenuAction<T>[]
}

export const GenericMenu = <T,>({ context, actions }: GenericMenuProps<T>): React.ReactElement => {
  const r = 75

  return (
    <>
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
      </div>
      {actions.map((action, i) => {
        const { position, label, icon } = action

        const radians = position * (Math.PI / 180)
        const [x, y] = [Math.cos(radians), Math.sin(radians)]
        const [dx, dy] = [x * (r + 12), y * (r + 12)]

        return (
          <>
            <button
              key={`transient-action-${i}-${position}`}
              className="absolute left-0 top-0 w-12 h-12 rounded-full bg-pale border-2 border-green z-10"
              style={{ transform: `translate(${-24 + dx}px, ${-24 + dy}px)` }}
            ></button>
          </>
        )
      })}
      <style jsx>{`
        @keyframes grow {
          0% {
            transform: scale(0);
          }
          25% {
            transform: scale(0);
          }
          85% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
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
          animation-timing-function: ease-in-out;
        }

        .donut-outer {
          animation-name: growr;
          animation-duration: 450ms;
          animation-fill-mode: forwards;
          animation-timing-function: cubic-bezier(0.47, 0, 0.745, 0.715);
        }
      `}</style>
    </>
  )
}
