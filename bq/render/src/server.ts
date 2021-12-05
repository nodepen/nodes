import dotenv from 'dotenv'
import { startup } from './startup'

dotenv.config()

const PORT = process.env.NP_RENDER_QUEUE_PORT || 9700

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
