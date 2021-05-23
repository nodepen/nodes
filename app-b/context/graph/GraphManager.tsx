import React, { useEffect } from 'react'
import { useSessionManager } from '../session'

type GraphManagerProps = {
  children?: JSX.Element
}

export const GraphManager = ({ children }: GraphManagerProps): React.ReactElement => {
  const { user } = useSessionManager()

  useEffect(() => {
    if (!user) {
      return
    }
  }, [user])

  return <>{children}</>
}
