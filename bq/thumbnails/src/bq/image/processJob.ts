import Queue from 'bee-queue'
import { admin } from '../../firebase'
import { scene, encoding } from '../../three'

type ThumbnailImageQueueJobData = {
  graphId: string
  solutionId: string
  revision: string
  graphJson: string // json string of nodepen graph elements
  graphBinaries: string // base64 string of bytearray
  graphSolution: string // json string of solution geometry and messages
}

export const processJob = async (
  job: Queue.Job<ThumbnailImageQueueJobData>
): Promise<unknown> => {
  const {
    graphId,
    solutionId,
    graphBinaries,
    graphJson,
    graphSolution,
    revision,
  } = job.data

  console.log(`[ JOB ${job.id.padStart(4, '0')} ] [ TQ:IMAGE ] [ START ]`)

  const bucket = admin.storage().bucket('np-graphs')
  const pathRoot = `${graphId}/${solutionId}`

  // Begin creating thumbnails
  const model = await scene.createScene(JSON.parse(graphSolution))
  const camera = scene.getThumbnailCamera(model)

  const image = encoding.toPNG(model, camera)

  const thumbnailFilePath = `${pathRoot}/thumb.png`
  const thumbFile = bucket.file(thumbnailFilePath)

  const stream = thumbFile.createWriteStream()
  image.pack().pipe(stream)

  // Update revision record in firestore

  return { ...job.data }
}
