const graphs = async (): Promise<string[]> => {
  console.log('get graphs')
  return ['a', 'b']
}

const session = async (
  parent: any,
  args: any,
  context: any,
  info: any
): Promise<string | undefined> => {
  console.log('get session')
  return 'session-id'
}

export const UserManifest = {
  graphs,
  session,
}
