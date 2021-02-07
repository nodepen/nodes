type GetUserArgs = {
  id: string
}

export const getUser = async (args: GetUserArgs): Promise<any> => {
  console.log(args)
  return { args }
}
