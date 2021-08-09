import firebase from 'firebase/app'
import 'firebase/auth'

import { config } from './firebase.auth'

if (typeof window !== 'undefined' && !firebase.apps.length) {
  firebase.initializeApp(config)
  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
}

export { firebase }
