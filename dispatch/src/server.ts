import express from 'express'
import parser from 'body-parser'
import { createJob } from './utils'
import redis from 'redis'
import asyncRedis from 'async-redis'
import dotenv from 'dotenv'

dotenv.config()

const syncdb = process.env.NP_DB_HOST
  ? redis.createClient({
      host: process.env.NP_DB_HOST,
      port: Number.parseInt(process.env.NP_DB_PORT),
    })
  : redis.createClient()

export const db = asyncRedis.decorate(syncdb)

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

const PORT = process.env.PORT || 8080

dispatch.listen(PORT)

console.log(`Dispatch listening on ${PORT}`)
