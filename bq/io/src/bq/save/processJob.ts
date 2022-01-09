import Queue from 'bee-queue'
import { GCP } from 'glib'
import { admin } from '../../firebase'
import { uploadFile } from '../../firebase/utils'
import { v4 as uuid } from 'uuid'
import atob from 'atob'

type SaveGraphJobData = {
  graphId: string
  solutionId: string
  revision: string
  graphJson: string // json string of nodepen graph elements
  graphBinaries: string // base64 string of bytearray
  graphSolution: string // json string of solution geometry and messages
}

export const processJob = async (
  job: Queue.Job<SaveGraphJobData>
): Promise<unknown> => {
  const {
    graphId,
    solutionId,
    graphBinaries,
    graphJson,
    graphSolution,
    revision,
  } = job.data

  const jobId = job.id.padStart(4, '0')
  const jobLabel = `[ JOB ${jobId} ] [ IO:SAVE ]`

  console.log(`${jobLabel} [ START ]`)
  console.log(`${jobLabel} ${graphId} / ${solutionId}`)

  const bucket = admin.storage().bucket('np-graphs')

  const pathRoot = `${graphId}/${solutionId}`

  // Create solution .json file
  const solutionFilePath = `${pathRoot}/${uuid()}.json`
  const solutionFileData = JSON.stringify(JSON.parse(graphSolution), null, 2)
  const solutionFileReference = await uploadFile(
    bucket,
    solutionFilePath,
    solutionFileData
  )

  // Create .gh file
  const ghFilePath = `${pathRoot}/${uuid()}.gh`

  let ghFileData: any = atob(graphBinaries)
  const bytes = new Array(ghFileData.length)
  for (let i = 0; i < ghFileData.length; i++) {
    bytes[i] = ghFileData.charCodeAt(i)
  }
  ghFileData = new Uint8Array(bytes)

  const ghFileReference = await uploadFile(bucket, ghFilePath, ghFileData)

  // Update revision record
  const fb = admin.firestore()

  const versionRef = fb
    .collection('graphs')
    .doc(graphId)
    .collection('revisions')
    .doc(revision.toString())
  const versionDoc = await versionRef.get()

  if (versionDoc.exists) {
    await versionRef.update(
      'files.graphBinaries',
      ghFileReference,
      'files.graphSolutionJson',
      solutionFileReference
    )
  }

  return { ...job.data, graphBinariesUrl: ghFileReference.url }
}
