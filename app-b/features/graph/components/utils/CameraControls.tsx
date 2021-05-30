import { useEffect } from 'react'
import { useCameraDispatch } from '../../store/hooks'
import { SetTransform } from '../../types'

type CameraControlsProps = {
  setTransform: SetTransform
}

/**
 * Consumes camera functions from `TransformWrapper` and registers them for global use.
 */
export const CameraControls = ({ setTransform }: CameraControlsProps): React.ReactElement => {
  const { registerSetTransform } = useCameraDispatch()

  useEffect(() => {
    registerSetTransform(setTransform)
  }, [])

  return <></>
}
