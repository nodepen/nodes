import React, { useContext } from 'react'

type GripContextProps = {
  children: JSX.Element
} & GripContextState

type GripContextState = {
  gripRef: React.RefObject<HTMLDivElement>
  register: (offset: [dx: number, dy: number]) => void
}

const Context = React.createContext<GripContextState>({ gripRef: React.createRef(), register: () => '' })

/**
 * Provides the `registerElementAnchor` target ref to any element's grip implementation.
 */
export const GripContext = ({ children, gripRef, register }: GripContextProps): React.ReactElement => {
  return <Context.Provider value={{ gripRef, register }}>{children}</Context.Provider>
}

export const useGripContext = (): GripContextState => {
  return useContext(Context)
}
