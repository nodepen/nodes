import React from "react"
import { COLORS } from "@/constants"

type DocumentViewErrorBoundaryProps = React.PropsWithChildren<{
    resetKeys?: unknown[]
}>

type DocumentViewErrorBoundaryState = {
    error: Error | null
}

class DocumentViewErrorBoundary extends React.Component<DocumentViewErrorBoundaryProps, DocumentViewErrorBoundaryState> {
    state: DocumentViewErrorBoundaryState = { error: null }

    static getDerivedStateFromError(error: Error): DocumentViewErrorBoundaryState {
        return { error }
    }

    componentDidCatch(error: Error, info: React.ErrorInfo): void {
        // eslint-disable-next-line no-console
        console.error("[DocumentViewErrorBoundary] document view crashed:", error, info.componentStack)
    }

    componentDidUpdate(prevProps: DocumentViewErrorBoundaryProps): void {
        if (!this.state.error) {
            return
        }

        const prevKeys = prevProps.resetKeys ?? []
        const nextKeys = this.props.resetKeys ?? []

        const didChange = prevKeys.length !== nextKeys.length || nextKeys.some((key, i) => key !== prevKeys[i])

        if (didChange) {
            this.reset()
        }
    }

    reset = (): void => {
        this.setState({ error: null })
    }

    render(): React.ReactNode {
        const { error } = this.state

        if (!error) {
            return this.props.children
        }

        return (
            <div className="np-w-full np-h-full np-flex np-items-center np-justify-center np-bg-pale np-select-none">
                <div className="np-max-w-[260px] np-flex np-flex-col np-items-center np-gap-1 np-text-center np-font-mono">
                    <svg width="36px" height="36px" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" className="size-6">
                        <rect x={1} y={1} width={18} height={18} rx={3} ry={3} fill="none" stroke={COLORS.GREEN} stroke-width="2" vectorEffect="non-scaling-stroke" />
                        <path d="M 5,15 L 5,14 A 2 2 0 0 1 7,12 L 13,12 A 2 2 0 0 1 15,14 L 15,15" stroke={COLORS.GREEN} stroke-width="2" vectorEffect="non-scaling-stroke" />
                        <line x1={8} y1={5} x2={8} y2={10} stroke={COLORS.GREEN} stroke-width="2" vectorEffect="non-scaling-stroke" />
                        <line x1={12} y1={5} x2={12} y2={10} stroke={COLORS.GREEN} stroke-width="2" vectorEffect="non-scaling-stroke" />
                    </svg>

                    <div className="np-text-xs np-uppercase np-text-dark np-font-panel">
                        ERROR
                    </div>

                    <p className="np-text-[11px] np-mt-2 np-text-dark np-font-panel">
                        Error while drawing the active document.
                    </p>

                    <p className="np-text-[11px] np-text-dark/60 np-font-panel">
                        Refresh or wait for new changes.
                    </p>
                </div>
            </div>
        )
    }
}

export default DocumentViewErrorBoundary
