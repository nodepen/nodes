import Queue from 'bee-queue'
import atob from 'atob'
import fs from 'fs'
import { admin } from '../../../firebase'
import { Storage } from '@google-cloud/storage'

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

  console.log(graphBinaries)

  let fileData: any = atob(graphBinaries)

  console.log(fileData)

  const bytes = new Array(fileData.length)
  for (let i = 0; i < fileData.length; i++) {
    bytes[i] = fileData.charCodeAt(i)
  }
  fileData = new Uint8Array(bytes)

  // const blob = new Blob([fileData], { type: 'application/octet-stream' })

  const bucket = admin.storage().bucket()

  fs.writeFileSync('test.gh', fileData)

  await bucket.upload('test.gh')

  fs.rmSync('test.gh')

  return { ...job.data }
}
