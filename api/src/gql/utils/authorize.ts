import { AuthenticationError } from 'apollo-server-errors'
import admin from 'firebase-admin'
import { NodePen } from 'glib'
import { UserRecord } from '../types'

type ResourceType = 'none' | 'graph'

type ResourceActions = {
  none: 'none'
  graph: 'view' | 'execute' | 'edit' | 'delete'
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

      if (!graphDoc.exists) {
        throw new AuthenticationError('Not authorized.')
      }

      const record = graphDoc.data() as NodePen.GraphManifest

      const isAuthor = user?.id && user?.id === record?.author?.id

      switch (resource.action) {
        case 'view': {
          // All graphs are currently public
          return [graphRef, graphDoc]
        }
        case 'edit': {
          // Only authors may edit their graphs
          if (!isAuthor) {
            throw new AuthenticationError(
              'Not authorized to edit the given resource.'
            )
          }

          return [graphRef, graphDoc]
        }
        case 'execute': {
          // Only authors may execute their graphs
          if (!isAuthor) {
            throw new AuthenticationError(
              'Not authorized to execute the given resource.'
            )
          }

          return [graphRef, graphDoc]
        }
        case 'delete': {
          // Only authors may execute their graphs
          if (!isAuthor) {
            throw new AuthenticationError(
              'Not authorized to delete the given resource.'
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
