import { useAppDispatch } from '$'
import { cameraActions } from '../cameraSlice'
import { CameraMode, CameraZoomLevel } from '../types'

export const useCameraDispatch = () => {
  const dispatch = useAppDispatch()

  return {
    setMode: (mode: CameraMode) => dispatch(cameraActions.setCameraMode(mode)),
    setLiveZoom: (zoom: number) => dispatch(cameraActions.setLiveZoom(zoom)),
    setStaticZoom: (zoom: number) => dispatch(cameraActions.setStaticZoom(zoom)),
    setZoomLevel: (level: CameraZoomLevel) => dispatch(cameraActions.setZoomLevel(level)),
    setLivePosition: (position: [number, number]) => dispatch(cameraActions.setLivePosition(position)),
    setStaticPosition: (position: [number, number]) => dispatch(cameraActions.setStaticPosition(position)),
    setZoomLock: (lock: boolean) => dispatch(cameraActions.setCameraZoomLock(lock)),
  }
}
