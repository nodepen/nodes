import Queue from 'bee-queue'
import axios from 'axios'

type SaveQueueJobData = {
  solutionId: string
  graphId: string
  graphJson: string
  revision: string
}

const GH_PORT = process.env?.NP_GH_PORT ?? 9900

export const processJob = async (
  job: Queue.Job<SaveQueueJobData>
): Promise<unknown> => {
  const { graphJson } = job.data

  const { data: graphBinaries } = await axios.post<string>(
    `http://localhost:${GH_PORT}/grasshopper/graph`,
    graphJson
  )

  const { data: graphSolution } = await axios.post(
    `http://localhost:${GH_PORT}/grasshopper/solve`,
    graphBinaries
  )

  return {
    ...job.data,
    graphBinaries,
    graphSolution: JSON.stringify(graphSolution),
  }
}
