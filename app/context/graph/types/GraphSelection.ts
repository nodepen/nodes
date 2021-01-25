export type GraphSelection = {
  element: string
  parameter:
    | '*'
    | {
        id: string
        item:
          | '*'
          | {
              path: string
              index: '*' | string[]
            }
      }
}
