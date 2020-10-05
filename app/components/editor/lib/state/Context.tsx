import React, { useReducer, useEffect } from 'react'
import { Grasshopper } from '@/../lib'
import { store as Store, initialState } from './store'
import { reducer } from './reducer'

type EditorContextProps = {
  children?: React.ReactNode
}

export const Context = ({ children }: EditorContextProps): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    const fetchServerConfiguration = async (): Promise<Grasshopper.Component[]> => {
      const response = await fetch('http://localhost:8081/grasshopper')
      const data: Grasshopper.Component[] = await response.json()
      return data
    }

    fetchServerConfiguration()
      .then((c) => dispatch({ type: 'library/load-server-config', components: c }))
      .catch((err) => {
        console.log(err)
      })
  }, [])

  return <Store.Provider value={{ state, dispatch }}>{children}</Store.Provider>
}
