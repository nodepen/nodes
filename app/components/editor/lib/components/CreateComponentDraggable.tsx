import React, { useState, useEffect, useContext } from 'react'
import { Grasshopper } from '@/../lib'
import { store } from '../state'

type DraggableProps = {
  component: Grasshopper.Component
}

export const CreateComponentDraggable = ({ component }: DraggableProps): JSX.Element => {
  const { dispatch } = useContext(store)

  const [isCreating, setIsCreating] = useState(false)
  const [previous, setPrevious] = useState(0)
  const [[x, y], setPosition] = useState<[number, number]>([0, 0])

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>): void => {
    setIsCreating(true)
    setPosition([e.pageX, e.pageY])
  }

  const handlePointerMove = (e: PointerEvent): void => {
    const now = Date.now()

    if (!isCreating || now - previous < 35) {
      return
    }

    setPrevious(now)

    const dx = e.pageX - x
    const dy = e.pageY - y

    setPosition([x + dx, y + dy])
  }

  const handlePointerUp = (): void => {
    if (!isCreating) {
      return
    }
    console.log(`Dispatching ${component.Name}`)
    setIsCreating(false)
  }

  useEffect(() => {
    document.documentElement.addEventListener('pointerup', handlePointerUp)
    document.documentElement.addEventListener('pointermove', handlePointerMove)

    return () => {
      document.documentElement.removeEventListener('pointerup', handlePointerUp)
      document.documentElement.removeEventListener('pointermove', handlePointerMove)
    }
  })

  return (
    <>
      <button
        className="h-full w-8 mr-2 inline-block border-2 rounded-sm transition-colors duration-200 border-green hover:border-swampgreen focus:outline-none focus:border-swampgreen"
        onPointerDown={handlePointerDown}
      >
        <div className="w-full h-full flex justify-center items-center">
          <img draggable="false" src={`data:image/png;base64,${component.Icon}`} alt={component.Name} />
        </div>
      </button>
      {isCreating ? (
        <div className="fixed w-5 h-5 border-darkgreen border-2 rounded-full" style={{ top: y - 10, left: x - 10 }} />
      ) : null}
    </>
  )
}
