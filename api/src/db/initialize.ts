import admin from 'firebase-admin'
import auth from '~/auth.json'

admin.initializeApp({ credential: admin.credential.cert(JSON.stringify(auth)) })

export const db = admin.firestore()
