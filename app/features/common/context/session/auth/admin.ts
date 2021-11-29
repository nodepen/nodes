import firebase, { ServiceAccount } from 'firebase-admin'
import credentials from './firebase.server.auth.json'

if (!firebase.apps || firebase.apps.length === 0) {
  firebase.initializeApp({
    credential: firebase.credential.cert(credentials as ServiceAccount),
  })
}

export const admin = firebase
