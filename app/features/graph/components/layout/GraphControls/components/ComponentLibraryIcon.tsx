import React, { useRef, useState } from 'react'
import Draggable, { DraggableEvent } from 'react-draggable'
import { Grasshopper } from 'glib'
import { useGraphDispatch } from 'features/graph/store/graph/hooks'
import { useCameraStaticPosition, useCameraStaticZoom } from 'features/graph/store/camera/hooks'
import { ComponentLibraryDetails } from './ComponentLibraryDetails'
import { addDefaultElement, getScreenPosition, screenSpaceToCameraSpace } from '../../../../utils'
import { useSessionManager } from '@/features/common/context/session'

type ComponentLibraryEntryProps = {
  template: Grasshopper.Component
}

export const ComponentLibraryIcon = ({ template }: ComponentLibraryEntryProps): React.ReactElement => {
  const { guid, name, category, icon } = template

  const { device } = useSessionManager()

  const { addElement } = useGraphDispatch()
  const zoom = useCameraStaticZoom()
  const [cx, cy] = useCameraStaticPosition()

  const entryRef = useRef<HTMLButtonElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  const [[x, y], setAnchor] = useState<[number, number]>([0, 0])
  const [showDetails, setShowDetails] = useState(false)

  const handleShowDetails = (): void => {
    setShowDetails(true)

    if (!entryRef.current) {
      return
    }

    if (device.breakpoint !== 'sm') {
      return
    }

    const { left, top } = entryRef.current.getBoundingClientRect()
    setAnchor([left + 24, top + 48 + 6])
  }

  const [[dx, dy], setDragPosition] = useState<[number, number]>([0, 0])
  const [showDraggable, setShowDraggable] = useState(false)
  const dragStart = useRef(0)

  const handleDragStart = (): void => {
    dragStart.current = Date.now()
    setShowDraggable(true)

    if (!imageRef.current) {
      return
    }

    const { left, top } = imageRef.current.getBoundingClientRect()
    setAnchor([left, top])
  }

  const handleDragStop = (e: DraggableEvent): void => {
    setShowDraggable(false)
    setDragPosition([0, 0])

    const delta = Date.now() - dragStart.current

    if (delta < 150) {
      // Interpret action as a click
      handleShowDetails()
      return
    }

    // Add element
    const [ex, ey] = getScreenPosition(e)
    const [x, y] = screenSpaceToCameraSpace({ offset: [0, 48 + 36], position: [ex, ey] }, { zoom, position: [cx, cy] })

    addDefaultElement(addElement, [x, y], template)
  }

  return (
    <>
      <button
        key={`library-${guid}`}
        ref={entryRef}
        onClick={handleShowDetails}
        className={`${
          showDraggable ? 'bg-swampgreen animate-pulse' : ''
        } w-12 h-12 inline-block transition-colors duration-75 md:hover:bg-swampgreen z-30`}
      >
        <div className="w-full h-full flex justify-center items-center pointer-events-none">
          <Draggable
            disabled={false}
            position={{ x: dx, y: dy }}
            onStart={handleDragStart}
            onDrag={(e, d) => {
              setDragPosition([d.x, d.y])
            }}
            onStop={(e) => {
              handleDragStop(e)
            }}
          >
            <img
              ref={imageRef}
              src={`data:image/png;base64,${icon}`}
              alt={`The icon for the ${name} component in ${category}.`}
              draggable="false"
              className="pointer-events-auto"
            />
          </Draggable>
        </div>
      </button>

      {showDetails ? (
        <ComponentLibraryDetails
          key={`lib-details-${template.guid}`}
          template={template}
          position={[x, y]}
          onDestroy={() => setShowDetails(false)}
        />
      ) : null}

      {showDraggable ? (
        <>
          <img
            className="fixed z-50"
            style={{ left: dx + x, top: dy + y }}
            src={`data:image/png;base64,${icon}`}
            alt={`The icon for the ${name} component in ${category}.`}
            draggable="false"
          />
          <img
            className="fixed opacity-30 z-50"
            style={{ left: x, top: y }}
            src={`data:image/png;base64,${icon}`}
            alt={`The icon for the ${name} component in ${category}.`}
            draggable="false"
          />
        </>
      ) : null}
    </>
  )
}
