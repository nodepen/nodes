import express, { Request, Response } from 'express'

const PORT = process.env.PORT || 3200

const app = express()
app.set('port', PORT)

app.get('/', (req: Request, res: Response) => {
  res.send('howdy')
})

app.listen(PORT, () => {
  console.log(`Server started. Listening on port ${PORT}`)
})
