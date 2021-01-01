import React, { useMemo, useState } from 'react'
import { io } from 'socket.io-client'
import { context as Context } from './state/context'
import { newGuid } from '~/utils'

type SessionManagerProps = {
  children?: React.ReactNode
}

export const SessionManager = ({ children }: SessionManagerProps): React.ReactElement => {
  const id = useMemo(() => newGuid(), [])

  const socket = io('http://localhost:3100')

  socket.on('connect', () => {
    console.log('Connection made!')
    socket.emit('join_request', id)
  })

  socket.on('handshake', (message) => {
    console.log(message)
  })

  const store = { io: socket, id }

  return <Context.Provider value={store}>{socket ? children : null}</Context.Provider>
}