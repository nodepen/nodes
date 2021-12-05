import { ClientOpts } from 'redis'

export const opts: ClientOpts = process.env.NP_DB_HOST
  ? {
      host: process.env.NP_DB_HOST,
      port: Number.parseInt(process.env?.NP_DB_PORT ?? '6379'),
    }
  : {}

export const prefix = process.env?.NP_GLOBAL_PREFIX ?? 'dev'
