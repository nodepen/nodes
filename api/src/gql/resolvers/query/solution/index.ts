import { value } from './value'

export const solution = async (
  _root: any,
  args: any,
  context: any,
  _info: any
) => {
  console.log('solution')

  console.log({ args })
  console.log({ context })

  return { value }
  return { value: { type: 'hm', value: 'hmmm' } }
}
