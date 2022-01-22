import React, { useEffect } from 'react'
import { useSceneDispatch } from '../../store/scene/hooks'
import { useSpaceBar } from '../../store/hotkey/hooks'

const SpaceBarObserver = (): React.ReactElement => {
  const { setDisplayMode } = useSceneDispatch()
  const pressed = useSpaceBar()

  useEffect(() => {
    setDisplayMode(pressed ? 'show' : 'hide')
  }, [pressed])

  return <></>
}

export default React.memo(SpaceBarObserver)
