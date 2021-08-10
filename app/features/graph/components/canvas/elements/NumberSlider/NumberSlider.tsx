import React, { useState } from 'react'
import { NodePen } from 'glib'
import Draggable from 'react-draggable'
import { UnderlayPortal } from '../../../underlay'
import { useDebugRender } from '@/hooks'

type NumberSliderProps = {
  element: NodePen.Element<'number-slider'>
}

const NumberSlider = ({ element }: NumberSliderProps): React.ReactElement => {
  const { template, current, id } = element

  useDebugRender(`NumberSlider | ${id}`)

  const [x, y] = current.position

  const [showUnderlay, setShowUnderlay] = useState(false)

  return (
    <>
      <div className="w-full h-full pointer-events-none absolute left-0 top-0 z-30">
        <div className="w-min h-full relative">
          <Draggable position={{ x, y }}>
            <div className="w-24 h-8 bg-white flex items-center justify-center">
              <button onClick={() => setShowUnderlay((current) => !current)}>TRY IT</button>
            </div>
          </Draggable>
        </div>
      </div>
      {showUnderlay ? (
        <UnderlayPortal parent={id}>
          <div>Howdy from number slider!</div>
        </UnderlayPortal>
      ) : null}
    </>
  )
}

export default React.memo(NumberSlider)
