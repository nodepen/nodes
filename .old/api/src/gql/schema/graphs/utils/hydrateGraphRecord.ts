import { admin } from '../../../../firebase/admin'
import { GraphResponse } from '../types'
/**
 * Format db record
 */
export const hydrateGraphRecord = (
  doc: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>
): GraphResponse => {
  const record: GraphResponse = {
    id: doc.id,
    name: doc.get('name'),
    author: {
      name: doc.get('author.name'),
      id: 'N/A',
    },
    files: {},
    stats: {
      views: doc.get('stats.views') ?? 0,
    },
    revision: doc.get('revision'),
  }

  return record
}
