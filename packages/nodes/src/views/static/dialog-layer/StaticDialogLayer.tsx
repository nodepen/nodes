import React from 'react'
import { useStore } from '$'
import { Layer } from '@/views/common'

export const StaticDialogLayer = () => {
  const dialogContainerRef = useStore((store) => store.registry.dialogRoot)

  return (
    <Layer id="np-dialog-layer" z={99} fixed>
      <div className="np-pointer-events-none np-w-full np-h-full" ref={dialogContainerRef} />
    </Layer>
  )
}
