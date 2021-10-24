import admin from 'firebase-admin'
import { UserRecord } from '../types'

type AuthorizationContext = {
  user: UserRecord
  resource: AuthorizationResource
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
  context: AuthorizationContext
): Promise<void> => {
  const { user, resource } = context

  const { id, name } = user

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
