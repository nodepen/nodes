import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import { Layout } from 'features/common'
import { Graph } from 'features'
import { GraphManager } from '@/features/graph/context/graph'
import { SolutionManager } from 'features/graph/context/solution'
import { KeyboardObserver } from 'features/common/observer'
import { ApolloContext } from '@/features/common/context/apollo'
import { useSessionManager } from '@/features/common/context/session'

const NewGrasshopperEditor: NextPage = () => {
  const { token } = useSessionManager()

  const Scene = dynamic(() => import('features/graph/components/scene/SceneContainer'))

  return (
    <>
      <Head>
        <script defer src="https://unpkg.com/smoothscroll-polyfill@0.4.4/dist/smoothscroll.min.js"></script>
      </Head>
      <ApolloContext token={token}>
        <Layout.Editor>
          <GraphManager>
            <SolutionManager>
              <>
                <Graph.Container />
                <Scene />
              </>
            </SolutionManager>
          </GraphManager>
        </Layout.Editor>
      </ApolloContext>
      <KeyboardObserver />
    </>
  )
}

export default NewGrasshopperEditor

// Opt out of static generation
export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  }
}
