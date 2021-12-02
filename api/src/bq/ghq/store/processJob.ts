import Queue from 'bee-queue'
import atob from 'atob'
import { admin } from '../../../firebase'

type StoreQueueJobData = {
  graphId: string
  solutionId: string
  revision: string
  graphJson: string // json string of nodepen graph elements
  graphBinaries: string // base64 string of bytearray
  graphSolution: string // json string of solution geometry and messages
}

export const processJob = async (
  job: Queue.Job<StoreQueueJobData>
): Promise<unknown> => {
  const { graphBinaries } = job.data

  console.log(
    ` [ JOB ] [ GH:STORE ] [ START ] [ OPERATION ${job.id.padStart(9, '0')}]`
  )

  let fileData: any = atob(graphBinaries)

  const bytes = new Array(fileData.length)
  for (let i = 0; i < fileData.length; i++) {
    bytes[i] = fileData.charCodeAt(i)
  }
  fileData = new Uint8Array(bytes)

  const bucket = admin.storage().bucket('np-graphs')

  const file = bucket.file('test-3.gh')
  await file.save(fileData)

  return { ...job.data }
}
