import React from 'react'
import { NodePen } from 'glib'

type WireProps = {
  wire: NodePen.Element<'wire'>
}

const Wire = ({ wire }: WireProps): React.ReactElement => {
  const { id, current, template } = wire
  const {
    from: [ax, ay],
    to: [bx, by],
  } = current

  const [x, y] = [Math.min(ax, bx), Math.min(ay, by)]
  const [width, height] = [Math.abs(bx - ax), Math.abs(by - ay)]

  return <div className="absolute pointer-events-none bg-red-300 z-0" style={{ width, height, left: x, top: y }}></div>
}

export default React.memo(Wire)
