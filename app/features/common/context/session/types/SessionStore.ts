import firebase from 'firebase/app'
import { UserRecord } from './UserRecord'

export type SessionStore = {
  user?: firebase.User
  userRecord?: UserRecord
  token?: string
  isAuthenticated: boolean
  device: {
    breakpoint: 'sm' | 'md'
    iOS: boolean
    width: number
  }
}
