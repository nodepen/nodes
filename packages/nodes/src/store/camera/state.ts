export type CameraState = {
    /** container div innerWidth / innerHeight in screen space */
    aspect: number
    /** coordinates of center pixel in container div in graph space */
    position: {
        x: number
        y: number
    }
    /** ratio of screen space pixel to graph space unit */
    zoom: number
}

export const key = 'camera'

export const initialState: CameraState = {
    aspect: 1.5,
    position: {
      x: 250,
      y: 0,
    },
    zoom: 1,
}