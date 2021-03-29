export type SessionStore = {
  session?: {
    id: string
  }
  user?: {
    id: string
    token: string
    name: string
  }
  error?: any
}
