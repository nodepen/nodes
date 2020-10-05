import React, { useContext } from 'react'
import { Glasshopper } from '@/../lib'
import { store } from '../state'

type GlasshopperComponentProps = {
  component: Glasshopper.Component
}

export const GlasshopperComponent = ({ component }: GlasshopperComponentProps): JSX.Element => {
  const { state } = useContext(store)

  const [tx, ty] = state.camera.position
  const [x, y] = component.position

  return (
    <div
      className="absolute w-12 h-12 bg-darkgreen rounded-md z-10"
      style={{ transform: `translate(${x + tx}px, ${-y + ty}px)`, left: 0, top: 0 }}
    />
  )
}
