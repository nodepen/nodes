import { Grasshopper } from 'glib'
import React, { useEffect, useRef } from 'react'

type ComponentLibraryDetailsProps = {
  template: Grasshopper.Component
  position: [number, number]
  onDestroy: () => void
}

export const ComponentLibraryDetails = ({
  template,
  position,
  onDestroy,
}: ComponentLibraryDetailsProps): React.ReactElement => {
  const { description, type } = template

  const [x, y] = position

  const detailsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!detailsRef.current) {
      return
    }

    const handleClick = (e: MouseEvent): void => {
      if (detailsRef?.current && e.target && !detailsRef.current.contains(e.target as any)) {
        onDestroy()
      }
    }

    window.addEventListener('click', handleClick)

    return () => {
      window.removeEventListener('click', handleClick)
    }
  })

  return (
    <>
      <div className="w-6 h-6 fixed z-10" style={{ left: x - 12, top: y }}>
        <svg className="w-6 h-6" viewBox="0 -1 10 10">
          <polyline points="1.5,4 8.5,4 8.5,7 1.5,7" fill="#FFF" stroke="none" />
          <polyline
            points="1.5,4.5 5,1 8.5,4.5"
            fill="#FFF"
            strokeWidth="2px"
            stroke="#333"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
      <div className="w-vw pl-4 pr-4 fixed" style={{ left: 0, top: y + 12 }} ref={detailsRef}>
        <div className="w-full flex justify-center">
          <div className="w-full p-4 bg-white border-2 border-dark rounded-md z-0" style={{ maxWidth: 400 }} />
        </div>
      </div>
    </>
  )
}
