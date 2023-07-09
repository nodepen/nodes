export type DocumentSolutionManifest = {
  runtimeDurationMs: number
  runtimeMessages: {
    [nodeInstanceId: string]: string
  }
}
