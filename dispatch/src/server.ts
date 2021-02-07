import express from 'express'
import parser from 'body-parser'
import { createJob } from './utils'
import redis from 'async-redis'

export const db = process.env.NP_DB
  ? redis.createClient(process.env.NP_DB)
  : redis.createClient()

const dispatch = express()
dispatch.use(parser.json())

dispatch.get('/config', async (req, res) => {
  const response = await createJob('alpha', { type: 'config' })
  res.send(response)
})

dispatch.post('/new/solution', async (req, res) => {
  const response = await createJob('alpha', { type: 'solution', ...req.body })
  res.send(response)
})

dispatch.listen(4100)

console.log('Dispatch listening on 4100')
