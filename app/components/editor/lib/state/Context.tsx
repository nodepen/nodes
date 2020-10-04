import React, { useReducer } from 'react'
import { store as Store, initialState } from './store'
import { reducer } from './reducer'

type EditorContextProps = {
  children?: React.ReactNode
}

export const Context = ({ children }: EditorContextProps): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return <Store.Provider value={{ state, dispatch }}>{children}</Store.Provider>
}
