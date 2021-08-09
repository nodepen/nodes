import { User } from 'firebase/auth'

export type SessionStore = {
  user?: User
  token?: string
  session: {
    id?: string
    initialize: (userId: string, graphId: string) => Promise<void>
  }
  device: {
    breakpoint: 'sm' | 'md'
    iOS: boolean
  }
}
