import { db } from '../../../db'
import { newGuid } from '../../../utils'

const graphs = async (parent: any): Promise<string[]> => {
  const { id } = parent
  const key = `user:${id}:graphs`

  return new Promise<string[]>((resolve, reject) => {
    db.get(key, (err, reply: string) => {
      if (err) {
        reject(err)
      }

      if (!reply) {
        // Return an empty array, since one is expected
        resolve([])
      }

      resolve(['b', 'c'])
    })
  })
}

const session = async (parent: any): Promise<string | undefined> => {
  const { id } = parent
  const key = `user:${id}:session`

  console.log(`Retrieving session id for user ${id}.`)

  return new Promise<string>((resolve, reject) => {
    db.get(key, (err, reply) => {
      if (err) {
        reject(err)
      }

      if (!reply) {
        // Create and set a session
        const session = newGuid()
        db.set(key, session)
        resolve(session)
      }

      resolve(reply)
    })
  })
}

export const UserManifest = {
  graphs,
  session,
}
