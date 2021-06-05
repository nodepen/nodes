import React from 'react'
import { useOverlayVisibility } from 'features/graph/store/overlay/hooks'
import { ParameterMenu } from '../overlay/ParameterMenu'

const GraphOverlay = (): React.ReactElement => {
  const { parameterMenu } = useOverlayVisibility()

  // console.log({ parameterMenu, tooltip })

  return <div className="w-full h-full relative">{parameterMenu ? <ParameterMenu /> : null}</div>
}

export default React.memo(GraphOverlay)
