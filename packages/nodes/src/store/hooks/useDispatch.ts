import { useEffect, useRef } from 'react'
import shallow from 'zustand/shallow'
import { useStore } from '$'


export const useDispatch = () => {
  return useStore((state) => state.dispatch, shallow)
}