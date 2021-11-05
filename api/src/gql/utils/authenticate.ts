import admin from 'firebase-admin'
import { UserRecord } from '../types'

/**
 * Verify that the incoming token is valid and current.
 * @returns Information about the user making the request.
 */
export const authenticate = async (token: string): Promise<UserRecord> => {
  const session = await admin.auth().verifyIdToken(token)
  const user = await admin.auth().getUser(session.uid)

  return {
    id: user.uid,
    name: user.displayName ?? 'anonymous',
  }
}
