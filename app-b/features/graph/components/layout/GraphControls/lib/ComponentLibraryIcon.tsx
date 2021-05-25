import React, { useRef, useState } from 'react'
import { Grasshopper } from 'glib'
import { ComponentLibraryDetails } from './ComponentLibraryDetails'

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

  return (
    <>
      <button
        key={`library-${guid}`}
        ref={entryRef}
        onClick={handleShowDetails}
        className="w-12 h-12 inline-block transition-colors duration-75 md:hover:bg-swampgreen"
      >
        <div className="w-full h-full flex justify-center items-center">
          <img src={`data:image/png;base64,${icon}`} alt={`The icon for the ${name} component in ${category}.`} />
        </div>
      </button>
      {showDetails ? (
        <ComponentLibraryDetails template={template} position={[x, y]} onDestroy={() => setShowDetails(false)} />
      ) : null}
    </>
  )
}
