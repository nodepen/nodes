import { initialize as initializeServer } from './gql'
import { db, initialize } from './redis'

import firebase, { ServiceAccount } from 'firebase-admin'
import credentials from './auth/auth.json'
import { pubsub } from './gql/pubsub'

firebase.initializeApp({
  credential: firebase.credential.cert(credentials as ServiceAccount),
})

const PORT = process.env.PORT || 4000

// api.listen({ port: PORT }).then(({ url }) => {
//   console.log(`Listening at ${url}`)
// })

initializeServer().then(({ server }) => {
  server.listen(PORT, () => {
    console.log('Listening!')
  })
})

// api.listen(PORT, () => {

// })

db.client.on('connect', () => {
  console.log('Redis connected!')
  // initialize(db.client)
})

// setTimeout(() => {
//   pubsub.publish('SOLUTION_COMPLETE', { onSolution: { solutionId: '123' } })
// }, 500)
