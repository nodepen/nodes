import { GCP } from 'glib'
import { admin } from '../../../../firebase'

export const FileReference = {
  url: async (parent: GCP.Storage.FileReference): Promise<string> => {
    console.log(parent)

    return 'ok'
  },
}
