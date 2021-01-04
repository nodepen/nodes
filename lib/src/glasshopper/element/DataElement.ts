export interface DataElement {
  current: {
    sources: {
      [key: string]: {
        element: string
        parameter: string
      }[]
    }
  }
}
