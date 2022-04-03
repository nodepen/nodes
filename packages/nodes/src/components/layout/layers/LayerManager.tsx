import React from 'react'
import { useLayerRefs } from './hooks'

type LayerManagerProps = {
  children: React.ReactNode
}

const LayerManager = ({ children }: LayerManagerProps): React.ReactElement => {
  const t = useLayerRefs()

  return <>{children}</>
}

export default React.memo(LayerManager)
