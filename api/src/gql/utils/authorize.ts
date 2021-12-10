import { AuthenticationError } from 'apollo-server-errors'
import admin from 'firebase-admin'
import { UserRecord } from '../types'

type AuthorizationContext = {
  user?: UserRecord
  resource?: AuthorizationResource
}

type AuthorizationResource = {
  id: string
} & (
  | {
      type: 'graph'
      action: 'view' | 'execute' | 'edit'
    }
  | {
      type: 'graph-reference'
      action: 'view' | 'edit'
    }
)

/**
 * Verify that the given user is authorized to perform the requested action on a given resource.
 * @remarks Will throw an error when any checks fail.
 */
export const authorize = async (
  user?: UserRecord,
  resource?: AuthorizationResource
): Promise<boolean> => {
  // if (process.env.DEBUG === 'true') {
  //   console.log('⚠️  Bypassing authorization!')
  //   return
  // }

  /**
   * Require that the request is coming from NodePen
   */
  const defaultAuthorization = (user?: UserRecord): boolean => {
    if (!user || !user.id || !user.name) {
      throw new AuthenticationError(
        `Not authorized to access the requested resource.`
      )
    }

    return true
  }

  if (!resource) {
    return defaultAuthorization(user)
  }

  switch (resource.type) {
    case 'graph': {
      switch (resource.action) {
        case 'view': {
          // All graphs are currently public
          return true
        }
        default: {
          return defaultAuthorization(user)
        }
      }
    }
    default: {
      return defaultAuthorization(user)
    }
  }
}
