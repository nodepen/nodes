import { Express } from 'express'
import UserRoutes from './users/router'

export const setup = (app: Express): void => {
  app.get('/', (req, res) => {
    res.send('howdy')
  })

  app.use('/api', UserRoutes)
}
