import dotenv from 'dotenv'
import { startup } from './startup'
import gl from 'gl'

dotenv.config()

const PORT = process.env.NP_RENDER_QUEUE_PORT || 9700

// Test gl
if (gl(400, 300) === null) {
  throw new Error('gl returned `null` ! Environment is misconfigured.')
}

startup()
  .then((app) => {
    app.listen(PORT, () => {
      console.log(
        `[ STARTUP ] NodePen render queue initialized! | Listening on port ${PORT}`
      )
    })
  })
  .catch((err) => {
    console.log(err)
  })
