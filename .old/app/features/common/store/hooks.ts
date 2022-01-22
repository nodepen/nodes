import { TypedUseSelectorHook, useDispatch, useSelector, useStore } from 'react-redux'
import type { RootState, RootDispatch } from './store'
import { store } from './store'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<RootDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const useAppStore = () => useStore() as typeof store
