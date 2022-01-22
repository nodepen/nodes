import { AuthenticationError } from 'apollo-server-errors'
import admin from 'firebase-admin'
import { NodePen } from 'glib'
import { UserRecord } from '../types'

type ResourceType = 'none' | 'graph'

type ResourceActions = {
  none: 'none'
  graph: 'view' | 'view-solution' | 'execute' | 'edit' | 'delete'
}

type ResourceRequest<T extends ResourceType> = {
  type: T
  id: string
  action: ResourceActions[T]
}

/**
 * Verify that the given user is authorized to perform the requested action on a given resource.
 * @remarks Will throw an error when any checks fail.
 */
export const authorize = async <T extends ResourceType>(
  user?: UserRecord,
  resource?: ResourceRequest<T>
): Promise<
  | [FirebaseFirestore.DocumentReference, FirebaseFirestore.DocumentSnapshot]
  | undefined
> => {
  /**
   * Require that the request is coming from NodePen
   */
  const defaultAuthorization = (user?: UserRecord): void => {
    if (!user || !user.id || !user.name) {
      throw new AuthenticationError(
        `Not authorized to access the requested resource.`
      )
    }
  }

  const allowAnonymous = (user?: UserRecord): void => {
    if (!user || !user.id || (!user.name && !user.isAnonymous)) {
      throw new AuthenticationError(
        `Not authorized to access the requested resource.`
      )
    }
  }

  if (!resource) {
    defaultAuthorization(user)
    return undefined
  }

  switch (resource.type) {
    case 'graph': {
      // Fetch graph
      const graphRef = await admin
        .firestore()
        .collection('graphs')
        .doc(resource.id)
      const graphDoc = await graphRef.get()

      // Handle cases where the requested resource does not exist
      if (!graphDoc.exists) {
        switch (resource.action) {
          case 'view-solution':
          case 'execute': {
            // Valid execution cases for graphs that don't exist:
            // - New graph never saved
            // - Public graph (shallow copy) run by anonymous user
            allowAnonymous(user)
            return [graphRef, graphDoc]
          }
          case 'edit': {
            // Editing a graph for the first time will create a record.
            defaultAuthorization(user)
            return [graphRef, graphDoc]
          }
          default: {
            throw new AuthenticationError('Not found.')
          }
        }
      }

      // Handle cases where the requested resource does exist
      const record = graphDoc.data() as NodePen.GraphManifest

      const isAuthor = user?.id && user?.id === record?.author?.id

      switch (resource.action) {
        case 'view': {
          // All graphs are currently public
          return [graphRef, graphDoc]
        }
        case 'edit':
        case 'execute':
        case 'delete': {
          // Only authors may edit, execute, or delete their graphs
          if (!isAuthor) {
            throw new AuthenticationError(
              `Not authorized to ${resource.action} the given resource.`
            )
          }

          return [graphRef, graphDoc]
        }
        default: {
          defaultAuthorization(user)

          return [graphRef, graphDoc]
        }
      }
    }
    default: {
      defaultAuthorization(user)
      return undefined
    }
  }
}
