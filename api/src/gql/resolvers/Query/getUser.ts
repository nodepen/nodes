const graphs = async (): Promise<string[]> => {
  return ['a', 'b']
}

const session = async (): Promise<string | undefined> => {
  return 'session-id'
}

export const getUser = {
  graphs,
  session,
}
