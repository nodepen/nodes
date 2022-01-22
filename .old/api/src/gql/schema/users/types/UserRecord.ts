export type UserRecord = {
  username: string
  usage: {
    ms: number
  }
  limits: {
    ms: number
    msPerSolution: number
  }
  time: {
    created: string
    visited: string
  }
}
