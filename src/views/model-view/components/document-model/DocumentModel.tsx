import { useStore } from '$'
import { ModelGeometryProvider } from '../../context/model-geometry'
import DocumentNodeModel from './DocumentNodeModel'

type DocumentModel = {
    modelUrl: string
}

export const DocumentModel = ({ modelUrl }: DocumentModel) => {
    const nodeIds = useStore((state) => Object.keys(state.document.nodes))

    return (
        <ModelGeometryProvider modelUrl={modelUrl}>
            {nodeIds.map((id) => (
                <DocumentNodeModel key={`model-node-${id}`} id={id} />
            ))}
        </ModelGeometryProvider>
    )
}