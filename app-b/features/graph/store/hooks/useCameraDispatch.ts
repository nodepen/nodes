import { useAppDispatch } from '$'
import { cameraActions } from '../cameraSlice'

export const useCameraDispatch = () => {
  return {
    setZoom: useAppDispatch()(cameraActions.setZoom),
    setPosition: useAppDispatch()(cameraActions.setPosition),
  }
}
