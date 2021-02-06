import express from 'express'
import { gql } from './gql'

const api = express()

api.use('/graphql', gql)

api.listen(4000)
