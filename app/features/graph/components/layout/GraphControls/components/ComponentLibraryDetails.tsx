import { Grasshopper } from 'glib'
import React, { useCallback, useRef } from 'react'
import { useOutsideClick } from 'hooks'

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

  const handlePointerDown = useCallback((): void => {
    onDestroy()
  }, [onDestroy])

  useOutsideClick(detailsRef, handlePointerDown)

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
            className="w-full p-4 flex flex-col bg-white border-2 border-dark rounded-md overflow-visible z-0"
            style={{ maxWidth: 400 }}
          >
            <h2 className="font-medium text-lg mb-1">{`${name} (${nickname})`}</h2>
            <p className="whitespace-normal">{description}</p>
          </div>
        </div>
      </div>
    </>
  )
}
