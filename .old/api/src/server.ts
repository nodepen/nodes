import dotenv from 'dotenv'
import { startup } from './startup'

dotenv.config()

const PORT = process.env.NP_API_PORT || 4000

startup()
  .then((api) => {
    api.listen(PORT, () => {
      console.log(
        `[ STARTUP ] NodePen API initialized! | Listening on port ${PORT}`
      )
    })
  })
  .catch((err) => {
    console.log(err)
  })
