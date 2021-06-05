import React from 'react'
import { useOverlayVisibility } from 'features/graph/store/overlay/hooks'

const GraphOverlay = (): React.ReactElement => {
  const { parameterMenu, tooltip } = useOverlayVisibility()

  // console.log({ parameterMenu, tooltip })

  return (
    <div className="w-full h-full relative">
      <div>{parameterMenu ? <div>parameter!</div> : null}</div>
    </div>
  )
}

export default React.memo(GraphOverlay)
