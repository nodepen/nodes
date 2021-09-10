import dotenv from 'dotenv'
import { db } from './db'
import express from 'express'

dotenv.config()

console.log('howdy!')

const port = 9800

const app = express()

app.get('/', (_, res) => {
  res.send('Ready to run')
})

app.listen(port, () => {
  console.log(`Dispatch listening on port ${port} !`)
})

db.client.on('ready', () => {
  console.log('Redis connection ready!')

  // setInterval(() => {
  //   db.client.publish(
  //     'SOLUTION_COMPLETE',
  //     JSON.stringify({
  //       onSolution: { solutionId: `DISPATCH ${Date.now().toString()}` },
  //     })
  //   )
  // }, 1000)
})
