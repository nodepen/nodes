import { getEnv } from '@/utils/env'
import * as authSchema from './auth'
import * as documentsSchema from './documents'
import * as speckleSchema from './speckle'
import { Client, ClientConfig } from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'

export const schema = {
  ...authSchema,
  ...documentsSchema,
  ...speckleSchema
}

const env = getEnv()

const config: ClientConfig = {
  host: env.POSTGRES_HOST,
  port: env.POSTGRES_PORT,
  user: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
  database: env.POSTGRES_DATABASE,
  ssl: {
    rejectUnauthorized: false
  }
}

let cachedClient: Client | null = null

export const getDb = async () => {
  const client = cachedClient ?? new Client(config)

  if (!cachedClient) {
    await client.connect()
    cachedClient = client
  }

  return drizzle(client, { schema })
}