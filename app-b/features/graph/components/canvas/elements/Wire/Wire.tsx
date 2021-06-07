import React from 'react'
import { NodePen } from 'glib'
import { useDebugRender } from '@/hooks'

type WireProps = {
  wire: NodePen.Element<'wire'>
}

const Wire = ({ wire }: WireProps): React.ReactElement => {
  const { id, current, template } = wire
  const {
    from: [ax, ay],
    to: [bx, by],
  } = current

  useDebugRender(`Wire | ${id}`)

  const [x, y] = [Math.min(ax, bx), Math.min(ay, by)]
  const [width, height] = [Math.abs(bx - ax), Math.abs(by - ay)]

  return (
    <div
      className={`${template.mode === 'provisional' ? 'bg-blue-300' : 'bg-red-300'} absolute pointer-events-none z-0`}
      style={{ width, height, left: x, top: y }}
    ></div>
  )
}

export default React.memo(Wire)
