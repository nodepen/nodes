import { NextPage } from 'next'
import { Layout } from 'features/common'

const GrasshopperEditor: NextPage = () => {
  return (
    <Layout.Editor>
      <div className="w-full h-full bg-pale" />
    </Layout.Editor>
  )
}

export default GrasshopperEditor
