import React, { useState, useEffect, useRef } from 'react'

type QuirkyDividerProps = {
  topColor: string
  bottomColor: string
  size?: number
  animate?: boolean
}

/**
 * A page divider that's just a little quirky 🤪
 */
export const QuirkyDivider = ({ topColor, bottomColor, size, animate }: QuirkyDividerProps): React.ReactElement => {
  const s = size ?? 48

  const [count, setCount] = useState(Math.round(1920 / s))

  const dividerRef = useRef<HTMLDivElement>(null)

  const handleResize = (): void => {
    if (!dividerRef.current) {
      return
    }

    const { width: w } = dividerRef.current.getBoundingClientRect()

    setCount(Math.round(w / s) * 20)
  }

  useEffect(() => {
    handleResize()
  }, [])

  useEffect(() => {
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  })

  return (
    <div
      className={`w-full whitespace-nowrap overflow-visible`}
      style={{ height: s + 8, transform: `translate(${-s}px, ${s / 4}px)` }}
    >
      <div className={`${animate ? 'marcher' : ''} z-20`} style={{ width: '200%', height: s / 2 }}>
        {Array(count)
          .fill('')
          .map((_, i) => (
            <div
              key={`div-top-${i}`}
              className="ml-2 inline-block rounded-md"
              style={{ width: s, height: s, backgroundColor: topColor, transform: 'scaleY(0.5) rotate(45deg)' }}
            />
          ))}
      </div>
      <div
        className={`${animate ? 'marcher' : ''} z-10`}
        style={{ width: '200%', height: s / 2, transform: `translate(${s / 2 + 4}px, -4px)` }}
      >
        {Array(count)
          .fill('')
          .map((_, i) => (
            <div
              key={`div-bottom-${i}`}
              className="ml-2 inline-block rounded-md"
              style={{ width: s, height: s, backgroundColor: bottomColor, transform: 'scaleY(0.5) rotate(45deg)' }}
            />
          ))}
      </div>

      <style jsx>{`
        @keyframes marchright {
          from {
            transform: translateX(-125px);
          }
          to {
            transform: translateX(0px);
          }
        }

        .marcher {
          animation-name: marchright;
          animation-iteration-count: infinite;
          animation-timing-function: linear;
          animation-direction: alternate;
          animation-duration: 5000ms;
        }
      `}</style>
    </div>
  )
}
