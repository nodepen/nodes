import { admin } from '../../../firebase'
import { v4 as uuid } from 'uuid'
import atob from 'atob'

export const handleSaveReady = async (message: string): Promise<string> => {
  const {
    graphId,
    solutionId,
    graphBinaries,
    graphJson,
    graphSolution,
    revision,
  } = JSON.parse(message)

  console.log(`[ PUBSUB ] [ SAVE_READY ] [ START ] ${graphId}`)

  const bucket = admin.storage().bucket('np-graphs')

  const pathRoot = `${graphId}/${solutionId}`

  // Create graph .json file
  const jsonFilePath = `${pathRoot}/${uuid()}.json`
  const jsonFile = bucket.file(jsonFilePath)

  const jsonFileData = JSON.stringify(JSON.parse(graphJson), null, 2)

  // Create solution .json file
  const solutionFilePath = `${pathRoot}/${uuid()}.json`
  const solutionFile = bucket.file(solutionFilePath)

  const solutionFileData = JSON.stringify(JSON.parse(graphSolution), null, 2)

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
    solutionFile.save(solutionFileData),
    ghFile.save(ghFileData),
  ])

  // Update revision record
  const fb = admin.firestore()

  const versionRef = fb
    .collection('graphs')
    .doc(graphId)
    .collection('revisions')
    .doc(revision.toString())
  const versionDoc = await versionRef.get()

  if (versionDoc.exists) {
    await versionRef.update('files.json', jsonFilePath, 'files.gh', ghFilePath)
  }

  return graphId
}
