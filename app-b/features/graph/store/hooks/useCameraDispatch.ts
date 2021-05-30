import { useAppDispatch } from '$'
import { cameraActions } from '../cameraSlice'
import { CameraState, CameraMode } from '../types'
import { SetTransform } from '../../types'

export const useCameraDispatch = () => {
  const dispatch = useAppDispatch()

  return {
    setMode: (mode: CameraMode) => dispatch(cameraActions.setCameraMode(mode)),
    setLiveZoom: (zoom: number) => dispatch(cameraActions.setLiveZoom(zoom)),
    setStaticZoom: (zoom: number) => dispatch(cameraActions.setStaticZoom(zoom)),
    setPosition: (position: CameraState['position']) => dispatch(cameraActions.setPosition(position)),
    setZoomLock: (lock: boolean) => dispatch(cameraActions.setCameraZoomLock(lock)),
    registerSetTransform: (setTransform: SetTransform) => dispatch(cameraActions.registerSetTransform(setTransform)),
  }
}
