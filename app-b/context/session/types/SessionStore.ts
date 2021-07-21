import firebase from 'firebase/app'

export type SessionStore = {
  user?: firebase.User
  token?: string
  session?: string
  device: {
    breakpoint: 'sm' | 'md'
    iOS: boolean
  }
}
