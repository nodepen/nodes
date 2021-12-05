import Queue from 'bee-queue'
import atob from 'atob'
import fs from 'fs'
import { Converter } from 'ffmpeg-stream'
import { admin } from '../../firebase'
import { v4 as uuid } from 'uuid'

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

  const bucket = admin.storage().bucket('np-graphs')
  const pathRoot = `${graphId}/${solutionId}`

  // Begin creating thumbnails
  const img = await createThumbnailImage()

  const thumbnailFilePath = `${pathRoot}/thumb.png`
  const thumbFile = bucket.file(thumbnailFilePath)

  const stream = thumbFile.createWriteStream()
  img.pack().pipe(stream)

  // command.size('400x300')

  const frames: string[] = []

  if (!fs.existsSync('./.temp')) {
    fs.mkdirSync('./.temp')
  }

  if (!fs.existsSync(`./.temp/${solutionId}`)) {
    fs.mkdirSync(`./.temp/${solutionId}`)
  }

  const conv = new Converter() // create converter
  // const input = conv.createInputStream({
  //   f: 'image2',
  //   r: '30',
  //   i: `./.temp/${solutionId}/%d.png`,
  // }) // create input writable stream

  conv.createInputFromFile(`./.temp/${solutionId}/%d.png`, {
    f: 'image2',
    r: '60',
  })
  // const input = conv.createInputFromFile()
  // conv.createOutputToFile('./out.mkv', {})
  conv.createOutputToFile('./out.mp4', {
    vcodec: 'libx264',
    pix_fmt: 'yuv420p',
  }) // output to file

  // input.on('close', () => console.log('closed!'))

  // for every frame create a function that returns a promise

  const writes: any[] = []

  for (const i of Array(600)
    .fill('')
    .map((_, n) => n)) {
    const frame = await createThumbnailImage(i)

    const key = `./.temp/${solutionId}/${i}.png`
    frames.push(key)

    console.log(key)

    // frame.pack().pipe(input, { end: false })
    // frame.pack().pipe(input)

    // writes.push(fs.writeFile(key, ))

    await new Promise<void>((resolve) => {
      const frameStream = fs.createWriteStream(key)
      frame.pack().pipe(frameStream)

      frameStream.on('close', () => {
        // fs.createReadStream(key).pipe(input, { end: false })
        resolve()
      })
    })

    // command.addInput(key)
  }

  // input.end()
  conv.run()

  return { ...job.data }
}
