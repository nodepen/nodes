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

  // useEffect(() => {
  //   setTimeout(() => {
  //     console.log('moving!')
  //     console.log(setTransform)
  //     setTransform(x + 35, y + 35, 1, 150, 'easeInOutQuad')
  //     setPosition([x + 35, y + 35])
  //   }, 5000)
  // }, [])

  useEffect(() => {
    registerSetTransform(setTransform)
  }, [])

  return <></>
}
