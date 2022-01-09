import { hydrateGraphRecord } from './hydrateGraphRecord'
import { GraphResponse } from '../types'

export const hydrateGraphRecords = (
  querySnapshot: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>
): GraphResponse[] => {
  return querySnapshot.docs.map((doc) => hydrateGraphRecord(doc))
}
