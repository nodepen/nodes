import fs from 'fs'
import path from 'path'
import express from 'express'
import axios from 'axios'
import { Grasshopper } from 'glib'
import { gql } from './gql'
import * as store from './store'
import { db } from './db'

const PORT = process.env.PORT || 4000

const api = express()

api.use('/graphql', gql)

const startup = async (): Promise<void> => {
  // Fetch grasshopper configuration from compute server
  const installed: Grasshopper.Component[] = []

  try {
    const { data } = await axios.request<Grasshopper.Component[]>({
      url: process.env.GL_SRV ?? 'http://localhost:8081/grasshopper',
    })

    installed.push(...data)
  } catch {
    const backupConfig: Grasshopper.Component[] = JSON.parse(
      fs
        .readFileSync(path.join(__dirname, 'data', 'fallback_config.json'))
        .toString()
    )

    installed.push(...backupConfig)
  }

  // Write allowed and installed to redis
  store.setServerConfig(installed)

  const allowed = store.serverConfig

  const writeBatch = db.multi()
  installed.forEach((component) => {
    writeBatch.set(`lib:installed:${component.guid}`, JSON.stringify(component))
  })
  writeBatch.del('lib:allowed')
  allowed.forEach(({ guid }, i) => {
    writeBatch.lset('lib:allowed', i, guid)
  })
  writeBatch.exec((err, reply) => {
    console.log(
      err
        ? err
        : `[ SET ${reply.length} ]\nUpdated definitions for ${installed.length} installed components.\nOf those, ${allowed.length} are allowed on Glasshopper.`
    )
  })
}

startup().then(() => {
  api.listen(PORT)
  console.log(`api listening on port ${PORT}`)
})
