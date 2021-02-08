import { db } from '../../../db'

const history = async (parent: any): Promise<string[]> => {
  const { id } = parent
  const key = `session:${id}:history`

  return new Promise<string[]>((resolve, reject) => {
    db.lrange(key, 0, -1, (err, reply) => {
      if (err) {
        reject(err)
      }

      resolve(reply ?? [])
    })
  })
}

const current = async (parent: any): Promise<string | undefined> => {
  const { id } = parent
  const key = `session:${id}:history`

  return new Promise<string | undefined>((resolve, reject) => {
    db.lrange(key, 0, 0, (err, reply) => {
      if (err) {
        reject(err)
      }

      resolve(reply?.[0])
    })
  })
}

export const SessionManifest = {
  history,
  current,
}
