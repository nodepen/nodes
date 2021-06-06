import React from 'react'
import { NodePen } from 'glib'

type WireProps = {
  wire: NodePen.Element<'wire'>
  from: NodePen.Element<'static-component'>
  to: NodePen.Element<'static-component'>
}

const Wire = ({ wire, from, to }: WireProps): React.ReactElement => {
  const { id, current, template } = wire

  const [x, y] = current.position
  const { width, height } = current.dimensions

  return <div className="absolute pointer-events-none bg-red-300 z-0" style={{ width, height, left: x, top: y }}></div>
}

export default React.memo(Wire)
