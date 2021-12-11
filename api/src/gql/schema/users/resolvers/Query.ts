import { authorize } from '../../../../gql/utils'
import { admin } from '../../../../firebase'
import { BaseResolverMap } from '../../base/types'
import { Arguments, UserRecord, UserReference } from '../types'

export const Query: BaseResolverMap<never, Arguments['Query']> = {
  currentUser: async (_parent, _arguments, { user }): Promise<UserRecord> => {
    await authorize(user)

    const db = admin.firestore()

    const userReference = db.collection('users').doc(user.id)
    const userDocument = await userReference.get()

    const currentTime = new Date().toISOString()

    if (!userDocument.exists) {
      // First visit, create record
      const currentUserRecord: UserRecord = {
        username: user.name,
        usage: {
          ms: 0,
        },
        limits: {
          ms: -1,
          msPerSolution: 10000,
        },
        time: {
          created: currentTime,
          visited: currentTime,
        },
      }

      await userReference.create(currentUserRecord)

      return currentUserRecord
    } else {
      // Returning visit, update and fetch record
      await userReference.update('time.visited', currentTime)

      const doc = userDocument

      return {
        username: doc.get('username'),
        usage: {
          ms: doc.get('usage.ms'),
        },
        limits: {
          ms: doc.get('limits.ms'),
          msPerSolution: doc.get('limits.msPerSolution'),
        },
        time: {
          created: doc.get('time.created'),
          visited: currentTime,
        },
      }
    }
  },
  publicUserByUsername: async (
    _parent,
    { username },
    { user }
  ): Promise<UserReference | undefined> => {
    const db = admin.firestore()

    const userQuery = db
      .collection('users')
      .where('username', '==', username)
      .limit(1)
    const userQueryResult = await userQuery.get()

    if (userQueryResult.size > 0) {
      // User does exist, return public reference
      const userRecord = userQueryResult.docs[0]

      return {
        username: userRecord.get('username'),
        graphs: [],
      }
    } else {
      // User does not exist
      return undefined
    }
  },
}
