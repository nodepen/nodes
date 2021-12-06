import { GetServerSideProps, NextPage } from 'next'
import { NodePen } from 'glib'
import nookies from 'nookies'

type GrasshopperGraphPageProps = {
  manifest: {
    id: string
    author: string
    name: string
  }
  graph: NodePen.Element<NodePen.ElementType>[]
  solution: NodePen.SolutionManifest['data']
}

const GrasshopperGraphPage: NextPage<GrasshopperGraphPageProps> = ({ manifest, graph, solution }) => {
  return <></>
}

export default GrasshopperGraphPage

export const getServerSideProps: GetServerSideProps<GrasshopperGraphPageProps> = async (context) => {
  try {
    const cookie = nookies.get(context)

    return {
      props: {
        manifest: {
          id: 'mutate-if-not-author',
          author: 'author',
          name: 'script name',
        },
        graph: [],
        solution: [],
      },
    }
  } catch {
    return { notFound: true }
  }
}
