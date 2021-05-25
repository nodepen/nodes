import { Grasshopper } from 'glib'
import React, { useEffect, useRef } from 'react'
import Draggable from 'react-draggable'

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
  const { name, nickname, description } = template

  const [x, y] = position

  const detailsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!detailsRef.current) {
      return
    }

    const handlePointerDown = (e: MouseEvent): void => {
      if (detailsRef?.current && e.target && !detailsRef.current.contains(e.target as any)) {
        onDestroy()
      }
    }

    window.addEventListener('pointerdown', handlePointerDown)

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown)
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
      <div className="w-vw pl-2 pr-2 fixed" style={{ left: 0, top: y + 12 }} ref={detailsRef}>
        <div className="w-full flex justify-center">
          <div
            className="w-full p-4 pb-0 flex flex-col bg-white border-2 border-dark rounded-md overflow-visible z-0"
            style={{ maxWidth: 400 }}
          >
            <h2>{`${name} (${nickname})`}</h2>
            <p>{description}</p>
            <div className="w-full p-4 mb-4 mt-4 bg-gray-100 rounded-md flex justify-around items-start">
              <svg
                className="w-6 h-6 animate-bounce"
                fill="none"
                stroke="#333"
                viewBox="0 -6 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              <Draggable>
                <button className="w-24 h-8 bg-white border-2 border-dark rounded-md shadow-osm z-20" />
              </Draggable>
              <svg
                className="w-6 h-6 animate-bounce"
                fill="none"
                stroke="#333"
                viewBox="0 -6 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
