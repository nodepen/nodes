import React, { useRef, useState } from 'react'
import { Grasshopper } from 'glib'
import { ComponentLibraryDetails } from './ComponentLibraryDetails'
import Draggable from 'react-draggable'

type ComponentLibraryEntryProps = {
  template: Grasshopper.Component
}

export const ComponentLibraryIcon = ({ template }: ComponentLibraryEntryProps): React.ReactElement => {
  const { guid, name, category, icon } = template

  const entryRef = useRef<HTMLButtonElement>(null)

  const [[x, y], setAnchor] = useState<[number, number]>([0, 0])
  const [showDetails, setShowDetails] = useState(false)

  const handleShowDetails = (): void => {
    setShowDetails(true)

    if (!entryRef.current) {
      return
    }

    const { left, top } = entryRef.current.getBoundingClientRect()
    setAnchor([left + 24, top + 48 + 6])
  }

  const [[dx, dy], setDragPosition] = useState<[number, number]>([0, 0])
  const [showDraggable, setShowDraggable] = useState(false)
  const dragStart = useRef(0)

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
        <Draggable
          disabled={false}
          position={{ x: dx, y: dy }}
          onStart={() => {
            dragStart.current = Date.now()
            setShowDraggable(true)
          }}
          onDrag={(e, d) => {
            setDragPosition([d.x, d.y])
          }}
          onStop={() => {
            setShowDraggable(false)
            setDragPosition([0, 0])

            const delta = Date.now() - dragStart.current

            if (delta < 150) {
              handleShowDetails()
            }
          }}
        >
          <div className="w-full h-full flex justify-center items-center">
            <img src={`data:image/png;base64,${icon}`} alt={`The icon for the ${name} component in ${category}.`} />
          </div>
        </Draggable>
      </button>

      {showDetails ? (
        <ComponentLibraryDetails
          key={`lib-details-${template.guid}`}
          template={template}
          position={[x, y]}
          onDestroy={() => setShowDetails(false)}
        />
      ) : null}
    </>
  )
}
