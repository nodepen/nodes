import { getEnv } from '@/utils/env'
import * as authSchema from './auth'
import * as documentsSchema from './documents'
import * as speckleSchema from './speckle'
import { Client, ClientConfig, Pool, PoolConfig } from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'

export const schema = {
  ...authSchema,
  ...documentsSchema,
  ...speckleSchema
}

const env = getEnv()

const config: PoolConfig = {
  host: env.POSTGRES_HOST,
  port: env.POSTGRES_PORT,
  user: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
  database: env.POSTGRES_DATABASE,
  ssl: {
    rejectUnauthorized: false
  },
  max: 5
}

export const getDb = async () => {
  const pool = new Pool(config)
  return drizzle(pool, { schema })
}