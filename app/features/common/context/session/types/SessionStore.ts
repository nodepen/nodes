import firebase from 'firebase/app'
import { UserRecord } from './UserRecord'

export type SessionStore = {
  user?: firebase.User
  userRecord?: UserRecord
  token?: string
  isAuthenticated: boolean
  session: {
    id?: string
    initialize: (userId: string, graphId: string) => Promise<void>
  }
  device: {
    breakpoint: 'sm' | 'md'
    iOS: boolean
  }
}
