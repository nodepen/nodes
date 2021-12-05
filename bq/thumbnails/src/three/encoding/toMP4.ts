import { Converter } from 'ffmpeg-stream'
import { v4 as uuid } from 'uuid'

/**
 *
 * @param inputPath /path/to/images/%d.png
 */
export const toMP4 = async (inputPath: string): Promise<string> => {
  const outputPath = `./.temp/vid/${uuid()}.mp4`

  const conv = new Converter()

  conv.createInputFromFile(inputPath, {
    f: 'image2',
    r: '60',
  })
  conv.createOutputToFile(outputPath, {
    vcodec: 'libx264',
    pix_fmt: 'yuv420p',
  })

  await conv.run()

  return outputPath
}
