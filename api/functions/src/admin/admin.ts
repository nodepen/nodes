import firebase, { ServiceAccount } from 'firebase-admin'
import credentials from './auth/auth.json'

export const admin = firebase.initializeApp({
  credential: firebase.credential.cert(credentials as ServiceAccount),
})
