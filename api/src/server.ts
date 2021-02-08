import fs from 'fs'
import path from 'path'
import axios from 'axios'
import { Grasshopper } from 'glib'
import * as store from './store'
import { db } from './db'
import { ApolloServer } from 'apollo-server'
import { resolvers, schema } from './gql'
import dotenv from 'dotenv'

const backup = require('./data/fallback_config.json')

dotenv.config()

const startup = async (): Promise<void> => {
  // Fetch grasshopper configuration from compute server
  const installed: Grasshopper.Component[] = []

  try {
    const { data } = await axios.request<Grasshopper.Component[]>({
      url: process.env.GL_SRV ?? 'http://localhost:8081/grasshopper',
    })

    installed.push(...data)
  } catch {
    const p = path.join(__dirname, 'data', 'fallback_config.json')
    console.log(`Using backup config @ ${p}`)
    // const backupConfig: Grasshopper.Component[] = JSON.parse(
    //   fs.readFileSync(p).toString()
    // )
    const backupConfig: Grasshopper.Component[] = backup

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

const api = new ApolloServer({ typeDefs: schema, resolvers })

const PORT = process.env.PORT || 8080

startup()
  .then(() => {
    return api.listen({ port: PORT })
  })
  .then(({ url }) => {
    console.log(`api ready at ${url}`)
  })
