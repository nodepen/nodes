import React from 'react'
import { NodePen } from 'glib'
import Wire from './Wire'
import { useLiveWireMotion } from './hooks/useLiveWireMotion'

type WireProps = {
  wire: NodePen.Element<'wire'>
}

const LiveWire = ({ wire }: WireProps): React.ReactElement => {
  const initialMode = wire.template.mode === 'live' ? wire.template.initial.mode : 'default'
  const initialPointer = wire.template.mode === 'live' ? wire.template.initial.pointer : 0

  const mode = useLiveWireMotion(initialMode, initialPointer)

  return (
    <>
      {/* Wire mode tooltip. */}
      <Wire wire={wire} />
    </>
  )
}

export default React.memo(LiveWire)
