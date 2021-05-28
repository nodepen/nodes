import { Grasshopper } from 'glib'
import React, { useCallback, useRef } from 'react'
import Draggable, { DraggableEvent } from 'react-draggable'
import { useGraphDispatch, useCamera } from 'features/graph/store/hooks'
import { screenSpaceToCameraSpace } from '@/features/graph/utils'
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

  const { addElement } = useGraphDispatch()
  const {
    zoom: { static: zoom },
    position: [cx, cy],
  } = useCamera()

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
              <Draggable
                onStop={(e) => {
                  const getScreenPosition = (e: DraggableEvent): [number, number] => {
                    switch (e.type) {
                      case 'mouseup':
                      case 'mouseend': {
                        const { pageX, pageY } = e as MouseEvent
                        return [pageX, pageY]
                      }
                      case 'touchend': {
                        const { pageX, pageY } = (e as TouchEvent).changedTouches[0]
                        return [pageX, pageY]
                      }
                      case 'pointerup': {
                        const { pageX, pageY } = e as PointerEvent
                        return [pageX, pageY]
                      }
                      default: {
                        console.error('Failed to translate draggable event to page coordinates!')
                        console.log(e)
                        return [0, 0]
                      }
                    }
                  }

                  const [ex, ey] = getScreenPosition(e)
                  const [x, y] = screenSpaceToCameraSpace(
                    { offset: [0, 48 + 36], position: [ex, ey] },
                    { zoom, position: [cx, cy] }
                  )

                  addElement({
                    type: 'static-component',
                    template: { type: 'static-component', ...template },
                    position: [x, y],
                  })
                  onDestroy()
                  return false
                }}
              >
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
