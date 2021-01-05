import React from 'react'
import { SessionStore } from '../types/SessionStore'

export const context = React.createContext<SessionStore>({} as any)
