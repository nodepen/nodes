import React, { useEffect } from 'react'
import { Grasshopper } from 'glib'
import { useSessionManager } from '~/context/session'

type GraphManagerProps = {
  children?: React.ReactNode
}

export const GraphManager = ({ children }: GraphManagerProps): React.ReactElement => {
  const { io, id } = useSessionManager()

  const onLoad = (): void => {
    console.log('setting up manager')
    io.on('lib', (res: Grasshopper.Component[]) => {
      console.log(res)
    })
  }

  useEffect(onLoad, [])

  return <>{children}</>
}