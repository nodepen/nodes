import { Component as GrasshopperComponent } from './../grasshopper/Component'

export interface Component {
  component: GrasshopperComponent
  position: [number, number]
  selected: boolean
}
