import { useAppDispatch } from '$'
import { cameraActions } from '../cameraSlice'
import { CameraState } from '../types'

export const useCameraDispatch = () => {
  const dispatch = useAppDispatch()

  return {
    setZoom: (zoom: CameraState['zoom']) => dispatch(cameraActions.setZoom(zoom)),
    setPosition: (position: CameraState['position']) => dispatch(cameraActions.setPosition(position)),
  }
}
