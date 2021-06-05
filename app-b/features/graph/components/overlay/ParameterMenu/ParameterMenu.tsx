import React, { useRef } from 'react'
import { assert } from 'glib'

import { useOutsideClick } from 'hooks'
import { useGraphElements } from 'features/graph/store/graph/hooks'
import { useCameraStaticZoom, useCameraStaticPosition } from 'features/graph/store/camera/hooks'
import { useParameterMenu, useOverlayDispatch } from 'features/graph/store/overlay/hooks'

import { isInputOrOutput } from 'features/graph/utils'

const ParameterMenu = (): React.ReactElement => {
  const elements = useGraphElements()
  const { sourceElementId, sourceParameterId } = useParameterMenu()
  const { clear } = useOverlayDispatch()

  const menuRef = useRef<HTMLDivElement>(null)

  useOutsideClick(menuRef, () => {
    clear()
  })

  const element = elements[sourceElementId]

  if (!assert.element.isStaticComponent(element)) {
    return <></>
  }

  const elementState = element.current

  if (!assert.element.isGraphElement(elementState)) {
    return <></>
  }

  const parameterMode = isInputOrOutput(element, sourceParameterId) === 'input' ? 'inputs' : 'outputs'

  const parameter = element.template[parameterMode][element.current[parameterMode][sourceParameterId]]

  return (
    <div className="w-full h-full relative">
      <div className={`${parameterMode === 'inputs' ? 'p-2 pr-14' : 'p-2 pl-14'} w-full flex flex-col`}>
        <div ref={menuRef} className="w-full p-4 border-2 border-dark rounded-md bg-white">
          <p>{parameter.name}</p>
        </div>
      </div>
    </div>
  )
}

export default React.memo(ParameterMenu)
