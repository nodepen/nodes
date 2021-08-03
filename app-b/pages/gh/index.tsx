import { NextPage } from 'next'
import Head from 'next/head'
import { Layout } from 'features/common'
import { Graph } from 'features'
import { GraphManager } from 'context/graph'
import { KeyboardObserver } from 'features/common/observer'

const GrasshopperEditor: NextPage = () => {
  return (
    <>
      <Head>
        <script defer src="https://unpkg.com/smoothscroll-polyfill@0.4.4/dist/smoothscroll.min.js"></script>
      </Head>
      <Layout.Editor>
        <GraphManager>
          <Graph.Container />
        </GraphManager>
      </Layout.Editor>
      <KeyboardObserver />
    </>
  )
}

export default GrasshopperEditor

// export const getServerSideProps: GetServerSideProps = async ({ req, res, params }) => {
//   const [type, owner, id] = (params?.['gh'] ?? []) as string[]

//   const response: GetServerSidePropsResult<any> = { redirect: { destination: '/', permanent: false } }

//   if (type !== 'gh') {
//     return response
//   }

//   // Fetch info
//   const { token } = req.cookies

//   switch (type) {
//     case 'gh': {
//       // Fetch graph and allow continu
//       break
//     }
//     default: {
//       return { redirect: '/' }
//     }
//   }

//   return { props: {} }
// }
