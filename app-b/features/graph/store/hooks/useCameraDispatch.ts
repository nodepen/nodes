import { useAppDispatch } from '$'
import { cameraActions } from '../cameraSlice'
import { CameraState } from '../types'

export const useCameraDispatch = () => {
  const dispatch = useAppDispatch()

  return {
    setMode: (mode: 'idle' | 'zooming') => dispatch(cameraActions.setCameraMode(mode)),
    setLiveZoom: (zoom: number) => dispatch(cameraActions.setLiveZoom(zoom)),
    setStaticZoom: (zoom: number) => dispatch(cameraActions.setStaticZoom(zoom)),
    setPosition: (position: CameraState['position']) => dispatch(cameraActions.setPosition(position)),
  }
}
