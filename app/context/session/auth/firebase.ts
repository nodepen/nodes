import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { setPersistence } from 'firebase/auth'

import { config } from './firebase.auth'

const firebase = initializeApp(config)

const auth = getAuth(firebase)
setPersistence(auth, { type: 'SESSION' })

// if (typeof window !== 'undefined' && !firebase.apps.length) {
//   initializeApp(config)
//   setPersistence(Persistence.SESSION)
// }

export { firebase, auth }
