import { useAppDispatch } from '$'
import { cameraActions } from '../cameraSlice'
import { CameraMode } from '../types'

export const useCameraDispatch = () => {
  const dispatch = useAppDispatch()

  return {
    setMode: (mode: CameraMode) => dispatch(cameraActions.setCameraMode(mode)),
    setLiveZoom: (zoom: number) => dispatch(cameraActions.setLiveZoom(zoom)),
    setStaticZoom: (zoom: number) => dispatch(cameraActions.setStaticZoom(zoom)),
    setLivePosition: (position: [number, number]) => dispatch(cameraActions.setLivePosition(position)),
    setStaticPosition: (position: [number, number]) => dispatch(cameraActions.setStaticPosition(position)),
    setZoomLock: (lock: boolean) => dispatch(cameraActions.setCameraZoomLock(lock)),
  }
}
