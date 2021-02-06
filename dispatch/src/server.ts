import express from 'express'
import { createJob } from './utils'

const dispatch = express()

dispatch.get('/config', async (req, res) => {
  const response = await createJob('alpha', { type: 'config' })
  res.send(response)
})

dispatch.listen(4100)

console.log('Dispatch listening on 4100')
