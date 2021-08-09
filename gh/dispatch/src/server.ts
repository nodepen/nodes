import dotenv from 'dotenv'
import { db } from './db'

dotenv.config()

db.client.on('ready', () => {
  console.log('Redis connection ready!')

  setInterval(() => {
    db.client.publish(
      'SOLUTION_COMPLETE',
      JSON.stringify({
        onSolution: { solutionId: `DISPATCH ${Date.now().toString()}` },
      })
    )
  }, 1000)
})
