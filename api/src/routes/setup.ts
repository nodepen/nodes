import { Express } from 'express'
import { Grasshopper } from 'glib'
import { serverConfig } from '../store'
import UserRoutes from './users/router'

export const setup = (app: Express): void => {
  app.get('/', (req, res) => {
    res.send(
      JSON.stringify(
        serverConfig.map((c) => toPascalCase(c)),
        null,
        2
      )
    )
  })

  app.use('/api', UserRoutes)
}

const toPascalCase = (c: Grasshopper.Component): any => {
  const paramToPascalCase = (p: Grasshopper.ComponentParameter): any => {
    return {
      Description: p['description'],
      IsOptional: p['isOptional'],
      Name: p['name'],
      NickName: p['nickName'],
      TypeName: p['type'],
    }
  }

  return {
    Guid: c['guid'],
    Name: c['name'],
    NickName: c['nickname'],
    Description: c['description'],
    Category: c['category'],
    Subcategory: c['subcategory'],
    LibraryName: c['libraryName'],
    Icon: c['icon'],
    Inputs: c['inputs'].map((i) => paramToPascalCase(i)),
    Outputs: c['outputs'].map((o) => paramToPascalCase(o)),
    IsObsolete: c['isObsolete'],
    IsVariable: c['isVariable'],
  }
}
