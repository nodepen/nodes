import dotenv from 'dotenv'
import { startup } from './startup'

dotenv.config()

const PORT = process.env.NP_IO_QUEUE_PORT || 9600

startup()
  .then((app) => {
    app.listen(PORT, () => {
      console.log(
        `[ STARTUP ] NodePen I/O queue initialized! | Listening on port ${PORT}`
      )
    })
  })
  .catch((err) => {
    console.log(err)
  })
