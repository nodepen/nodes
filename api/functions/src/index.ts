import * as functions from "firebase-functions";
import { admin } from './admin'

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

export const initializeUser = functions.auth.user().onCreate(async (user, context) => {
  if (user.providerData.length === 0) {
    // Anonymous, do nothing
    return user
  }

  const db = admin.firestore()

  const userRef = db
    .collection('users')
    .doc(user.uid)

  await userRef.create({
    username: user.displayName ?? 'NodePen User',
    time: {
      created: new Date().toISOString(),
      visited: new Date().toISOString(),
    },
    usage: {
      ms: 0,
    },
    limits: {
      ms: -1,
      duration: 1000 * 10,
    }
  })

  console.log(`Created record for user ${user.uid}`)

    return user
})

// export const someCron = functions.pubsub.schedule('5 * * * *').onRun((context) => {
//   console.log('Fires every 5 minutes!')
// })
