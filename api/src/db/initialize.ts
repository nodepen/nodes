import redis from 'redis'

export const db = process.env.NP_DB_HOST
  ? redis.createClient({
      host: process.env.NP_DB_HOST,
      port: Number.parseInt(process.env.NP_DB_PORT),
    })
  : redis.createClient()

export const initialize = (): void => {
  db.on('connect', () => {
    console.log('Connected to db!')

    db.hset('hash-test', 'first', '100', () => {
      db.hkeys('hash-test', (err, reply) => {
        console.log(reply)
      })
      // db.hgetall('hash-test', (err, reply) => {
      //   console.log(reply)
      // })
    })
  })
}
