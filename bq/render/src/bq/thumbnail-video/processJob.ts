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

  const bucket = admin.storage().bucket('np-graphs')
  const pathRoot = `${graphId}/${solutionId}`

  // Generate frames
  const model = await scene.createScene(JSON.parse(graphSolution))
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
  const inputPath = `./temp/${pathRoot}/frames/%04d.png`
  const outputPath = `./temp/${pathRoot}/${uuid()}.mp4`

  console.log(`${jobLabel} Encoding video...`)

  await encoding.toMP4(inputPath, outputPath, FPS)

  console.log(`${jobLabel} Successfully encoded video!`)

  return job.data
}
