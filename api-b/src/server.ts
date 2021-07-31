import { db, initialize } from './redis'
import { api } from './gql'

import firebase, { ServiceAccount } from 'firebase-admin'
import credentials from './auth/auth.json'
import { pubsub } from './gql/pubsub'

firebase.initializeApp({
  credential: firebase.credential.cert(credentials as ServiceAccount),
})

const PORT = process.env.PORT || 4000

api.listen({ port: PORT }).then(({ url }) => {
  console.log(`Listening at ${url}`)
})

db.client.on('connect', () => {
  initialize(db.client)
})

// setTimeout(() => {
//   pubsub.publish('SOLUTION_COMPLETE', { onSolution: { solutionId: '123' } })
// }, 500)
