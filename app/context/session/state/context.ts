import React from 'react'
import { io } from 'socket.io-client'
import { SessionStore } from '../types/SessionStore'

export const context = React.createContext<SessionStore>({} as any)