import React from 'react'
import { NodePen } from 'glib'

type NumberSliderProps = {
  element: NodePen.Element<'number-slider'>
}

const NumberSlider = ({ element }: NumberSliderProps): React.ReactElement => {
  const { template, current, id } = element

  return <></>
}

export default React.memo(NumberSlider)
