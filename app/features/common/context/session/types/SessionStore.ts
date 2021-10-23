import firebase from 'firebase/app'

export type SessionStore = {
  user?: firebase.User
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
