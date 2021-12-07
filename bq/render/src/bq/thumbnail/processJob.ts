import Queue from 'bee-queue'
import { admin } from '../../firebase'
import { scene, encoding } from '../../three'
import { v4 as uuid } from 'uuid'
import fs from 'fs'

type RenderThumbnailImageQueueJobData = {
  graphId: string
  solutionId: string
  revision: string
  graphJson: string // json string of nodepen graph elements
  graphBinaries: string // base64 string of bytearray
  graphSolution: string // json string of solution geometry and messages
}

export const processJob = async (
  job: Queue.Job<RenderThumbnailImageQueueJobData>
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
  const jobLabel = `[ JOB ${jobId} ] [ RQ:THUMBNAIL ]`

  console.log(`${jobLabel} [ START ]`)

  const bucket = admin.storage().bucket('np-graphs')
  const pathRoot = `${graphId}/${solutionId}`

  // Begin creating thumbnails
  const model = await scene.createScene(JSON.parse(graphSolution))
  const camera = scene.getThumbnailCamera(model)

  scene.setCameraOrbit(camera, [0, 0, 1], 5, 0)

  const image = encoding.toPNG(model, camera)

  const thumbnailFilePath = `${pathRoot}/${uuid()}.png`
  const thumbFile = bucket.file(thumbnailFilePath)

  // Write to storage
  const stream = thumbFile.createWriteStream()
  image.pack().pipe(stream)

  await new Promise<void>((resolve, reject) => {
    stream.on('finish', () => {
      console.log(`${jobLabel} Uploaded ${thumbnailFilePath}`)
      resolve()
    })
    stream.on('error', () => {
      reject()
    })
  })

  // Update firestore record with the thumbnail's location
  const revisionRef = admin
    .firestore()
    .collection('graphs')
    .doc(graphId)
    .collection('revisions')
    .doc(revision.toString())
  const revisionDoc = await revisionRef.get()

  if (!revisionDoc.exists) {
    console.error(
      `${jobLabel} [ ERROR ] Failed to update revision doc because it does not exist.`
    )
    return job.data
  }

  await revisionRef.update('files.thumbnailImage', thumbnailFilePath)

  return job.data
}
