import dotenv from 'dotenv'
import { startup } from './startup'

dotenv.config()

const PORT = process.env.PORT || 9801

startup()
  .then((dispatch) => {
    dispatch.listen(PORT, () => {
      console.log(
        `[ STARTUP ] NodePen Grasshopper Dispatch initialized! | Listening on port ${PORT}`
      )
    })
  })
  .catch((err) => {
    console.log(err)
  })

// const port = 9800

// const app = express()

// app.get('/', (_, res) => {
//   res.send('Ready to run')
// })

// app.listen(port, () => {
//   console.log(`Dispatch listening on port ${port} !`)
// })

// db.client.on('ready', () => {
//   console.log('Redis connection ready!')

//   // setInterval(() => {
//   //   db.client.publish(
//   //     'SOLUTION_COMPLETE',
//   //     JSON.stringify({
//   //       onSolution: { solutionId: `DISPATCH ${Date.now().toString()}` },
//   //     })
//   //   )
//   // }, 1000)
// })
