import React from 'react'
import { GenericMenuStore } from '../types'

export const GenericMenuContext = React.createContext<GenericMenuStore>({
  onCancel: () => '',
})

type GenericMenuContextProps = {
  children?: JSX.Element
  onCancel: () => void
}

export const GenericMenuManager = ({ children, onCancel }: GenericMenuContextProps): React.ReactElement => {
  const store: GenericMenuStore = {
    onCancel,
  }

  return <GenericMenuContext.Provider value={store}>{children}</GenericMenuContext.Provider>
}
