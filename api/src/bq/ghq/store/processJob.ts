import Queue from 'bee-queue'
import atob from 'atob'
import { admin } from '../../../firebase'
import { v4 as uuid } from 'uuid'

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
  const { graphId, solutionId, graphBinaries, graphJson, revision } = job.data

  console.log(
    ` [ JOB ] [ GH:STORE ] [ START ] [ OPERATION ${job.id.padStart(9, '0')}]`
  )

  const bucket = admin.storage().bucket('np-graphs')

  const pathRoot = `${graphId}/${solutionId}`

  // Create .json file
  const jsonFilePath = `${pathRoot}/${uuid()}.json`
  const jsonFile = bucket.file(jsonFilePath)

  const jsonFileData = JSON.stringify(JSON.parse(graphJson), null, 2)

  // Create .gh file
  const ghFilePath = `${pathRoot}/${uuid()}.gh`
  const ghFile = bucket.file(ghFilePath)

  let ghFileData: any = atob(graphBinaries)

  const bytes = new Array(ghFileData.length)
  for (let i = 0; i < ghFileData.length; i++) {
    bytes[i] = ghFileData.charCodeAt(i)
  }
  ghFileData = new Uint8Array(bytes)

  // Upload graph files
  const uploadResult = await Promise.allSettled([
    jsonFile.save(jsonFileData),
    ghFile.save(ghFileData),
  ])

  // Update revision record
  const db = admin.firestore()

  const versionRef = db
    .collection('graphs')
    .doc(graphId)
    .collection('revisions')
    .doc(revision.toString())
  const versionDoc = await versionRef.get()

  if (versionDoc.exists) {
    await versionRef.update('files.json', jsonFilePath, 'files.gh', ghFilePath)
  }

  return { ...job.data }
}
