import React from 'react'
import { NodePen } from 'glib'
import Wire from './Wire'
import { useLiveWireMotion } from './hooks'

type WireProps = {
  wire: NodePen.Element<'wire'>
}

const LiveWire = ({ wire }: WireProps): React.ReactElement => {
  const initialMode = wire.template.mode === 'live' ? wire.template.initial.mode : 'default'
  const initialPointer = wire.template.mode === 'live' ? wire.template.initial.pointer : 0

  const allowTranspose = wire.template.mode === 'live' && wire.template.transpose

  const mode = useLiveWireMotion(initialMode, initialPointer, allowTranspose)

  return (
    <>
      {/* Wire mode tooltip. */}
      <Wire wire={wire} />
    </>
  )
}

export default React.memo(LiveWire)
