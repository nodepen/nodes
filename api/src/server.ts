import { startup } from './startup'

const PORT = process.env.NP_API_PORT || 4000

startup().then((api) => {
  api.listen(PORT, () => {
    console.log(
      `[ STARTUP ] NodePen API initialized! | Listening on port ${PORT}`
    )
  })
})

// initializeServer().then(({ server }) => {
//   server.listen(PORT, () => {
//     console.log('Listening!')
//   })
// })

// console.log({ dbHost: process.env.NP_DB_HOST })
// console.log({ dbPort: process.env.NP_DB_PORT })

// // api.listen(PORT, () => {

// // })

// db.client.on('connect', () => {
//   console.log('Redis connected!')
//   // initialize(db.client)
// })
