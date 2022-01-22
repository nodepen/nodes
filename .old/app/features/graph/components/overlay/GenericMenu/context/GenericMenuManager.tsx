import React from 'react'
import { GenericMenuStore } from '../types'

export const GenericMenuContext = React.createContext<GenericMenuStore>({
  onCancel: () => '',
  onClose: () => '',
})

type GenericMenuContextProps = {
  children?: JSX.Element
  onCancel: () => void
  onClose: () => void
}

export const GenericMenuManager = ({ children, onCancel, onClose }: GenericMenuContextProps): React.ReactElement => {
  const store: GenericMenuStore = {
    onCancel,
    onClose,
  }

  return <GenericMenuContext.Provider value={store}>{children}</GenericMenuContext.Provider>
}
