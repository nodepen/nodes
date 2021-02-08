import axios from 'axios'

export const updateConfiguration = async (): Promise<string> => {
  console.log('running mutation')
  const { data } = await axios.get('http://localhost:4100/config')

  return `Created job ${data.id}`
}
