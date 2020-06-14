import express, { Request, Response } from 'express'

const router = express.Router()

const doUserThing = (req: Request, res: Response) => {
  res.status(200).json({ msg: 'ok hi' })
}

router.get('/user', doUserThing)

export default router
