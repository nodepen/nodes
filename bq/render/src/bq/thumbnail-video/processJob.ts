import Queue from 'bee-queue'
import { admin } from '../../firebase'
import { scene, encoding } from '../../three'
import { v4 as uuid } from 'uuid'
import fs from 'fs'

type RenderThumbnailVideoQueueJobData = {
  graphId: string
  solutionId: string
  revision: string
  graphJson: string // json string of nodepen graph elements
  graphBinaries: string // base64 string of bytearray
  graphSolution: string // json string of solution geometry and messages
}

export const processJob = async (
  job: Queue.Job<RenderThumbnailVideoQueueJobData>
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
  const jobLabel = `[ JOB ${jobId} ] [ RQ:THUMBNAIL-VID ]`

  console.log(`${jobLabel} [ START ]`)

  const pathRoot = `${graphId}/${solutionId}`

  // Verify that we still need this thumbnail
  const db = admin.firestore()

  const graphRef = db.collection('graphs').doc(graphId)
  const graphDoc = await graphRef.get()

  const currentRevision = graphDoc.get('revision')

  if (revision.toString() !== currentRevision.toString()) {
    console.log(
      `${jobLabel} [ SKIP ] Job data is for revision ${revision}, but latest is revision ${currentRevision}.`
    )
    return job.data
  }

  // Generate frames
  const model = await scene.createScene(
    JSON.parse(graphJson),
    JSON.parse(graphSolution)
  )
  const camera = scene.getThumbnailCamera(model)

  const ROTATION = 360
  const DURATION = 10
  const FPS = 60

  const step = ROTATION / (DURATION * FPS)
  const stepCount = Math.round(ROTATION / step)

  for (let i = 0; i < stepCount; i++) {
    console.log(
      `${jobLabel} Rendering frame ${i
        .toString()
        .padStart(4, '0')} / ${stepCount.toString().padStart(4, '0')}`
    )

    // Initialize directories
    if (!fs.existsSync('./temp/')) {
      fs.mkdirSync('./temp/')
    }

    if (!fs.existsSync(`./temp/${graphId}/`)) {
      fs.mkdirSync(`./temp/${graphId}/`)
    }

    if (!fs.existsSync(`./temp/${graphId}/${solutionId}`)) {
      fs.mkdirSync(`./temp/${graphId}/${solutionId}`)
    }

    if (!fs.existsSync(`./temp/${graphId}/${solutionId}/frames`)) {
      fs.mkdirSync(`./temp/${graphId}/${solutionId}/frames`)
    }

    const deg = i * step
    scene.setCameraOrbit(camera, [0, 0, 1], 5, deg)

    const frame = encoding.toPNG(model, camera)
    const framePath = `./temp/${pathRoot}/frames/${i
      .toString()
      .padStart(4, '0')}.png`

    const frameStream = fs.createWriteStream(framePath)
    frame.pack().pipe(frameStream, { end: true })

    await new Promise<void>((resolve) => {
      frameStream.on('finish', resolve)
      frameStream.on('close', resolve)
      frameStream.on('error', resolve)
    })
  }

  // Encode frames as video
  const videoFileName = `${uuid()}.mp4`

  const inputPath = `./temp/${pathRoot}/frames/%04d.png`
  const outputPath = `./temp/${pathRoot}/${videoFileName}`

  console.log(`${jobLabel} Encoding video...`)

  await encoding.toMP4(inputPath, outputPath, FPS)

  console.log(`${jobLabel} Successfully encoded video ${outputPath}`)

  // Write to storage bucket
  const bucket = admin.storage().bucket('np-graphs')
  const thumbnailVideoFile = bucket.file(`${pathRoot}/${videoFileName}`)
  const videoData = fs.readFileSync(outputPath)
  await thumbnailVideoFile.save(videoData)

  // Update revision record with video path
  const revisionRef = db
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

  await revisionRef.update(
    'files.thumbnailVideo',
    `${pathRoot}/${videoFileName}`
  )

  // Delete temp files used for creating the video
  fs.rmdirSync(`./temp/${pathRoot}`, { recursive: true })

  return job.data
}
