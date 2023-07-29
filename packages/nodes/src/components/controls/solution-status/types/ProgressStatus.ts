export type ProgressStatus = {
  progress: number
  statusLevel: 'normal' | 'pending' | 'error'
  statusMessage: string
}
