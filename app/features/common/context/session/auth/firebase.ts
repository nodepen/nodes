import firebase from 'firebase/app'
import 'firebase/auth'

import config from './firebase.client.auth.json'

if (typeof window !== 'undefined' && !firebase.apps.length) {
  firebase.initializeApp(config)
  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)

  if (process.env.NEXT_PUBLIC_DEBUG === 'true') {
    console.debug('⚠ Pointing Firebase services to local emulators.')
    firebase.auth().useEmulator('http://localhost:9099')
  }
}

export { firebase }
