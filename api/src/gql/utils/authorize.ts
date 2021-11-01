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
): Promise<void> => {
  if (!user) {
    throw new AuthenticationError(
      `Not authorized to access the requested resource.`
    )
  }

  switch (resource.type) {
    case 'graph': {
      const t = resource.action
      break
    }
    case 'graph-reference': {
      const t = resource.action
      break
    }
  }

  return
}
