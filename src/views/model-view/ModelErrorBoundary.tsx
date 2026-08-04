import React from "react"
import { COLORS } from "@/constants"

type ModelErrorBoundaryProps = React.PropsWithChildren<{
    /** Boundary resets automatically whenever any value in this list changes (e.g. a new model url). */
    resetKeys?: unknown[]
}>

type ModelErrorBoundaryState = {
    error: Error | null
}

/**
 * Catches render/mount-time failures from the 3D viewport — most commonly a missing/limited
 * WebGL context, or a loader throwing on a bad model url — and shows a static fallback instead
 * of taking down the rest of the app.
 */
class ModelErrorBoundary extends React.Component<ModelErrorBoundaryProps, ModelErrorBoundaryState> {
    state: ModelErrorBoundaryState = { error: null }

    static getDerivedStateFromError(error: Error): ModelErrorBoundaryState {
        return { error }
    }

    componentDidCatch(error: Error, info: React.ErrorInfo): void {
        // eslint-disable-next-line no-console
        console.error("[ModelErrorBoundary] viewport crashed:", error, info.componentStack)
    }

    componentDidUpdate(prevProps: ModelErrorBoundaryProps): void {
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
                <div className="np-max-w-[260px] np-flex np-flex-col np-items-center np-gap-2 np-text-center np-font-mono">
                    <svg width="36px" height="36px" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" className="size-6">
                        <rect x={1} y={1} width={18} height={18} rx={3} ry={3} fill="none" stroke={COLORS.GREEN} stroke-width="2" vectorEffect="non-scaling-stroke" />
                        <path d="M 5,15 L 5,14 A 2 2 0 0 1 7,12 L 13,12 A 2 2 0 0 1 15,14 L 15,15" stroke={COLORS.GREEN} stroke-width="2" vectorEffect="non-scaling-stroke" />
                        <line x1={8} y1={5} x2={8} y2={10} stroke={COLORS.GREEN} stroke-width="2" vectorEffect="non-scaling-stroke" />
                        <line x1={12} y1={5} x2={12} y2={10} stroke={COLORS.GREEN} stroke-width="2" vectorEffect="non-scaling-stroke" />
                    </svg>

                    <div className="np-text-xs np-tracking-[0.2em] np-uppercase np-text-dark np-font-panel">
                        3D GEOMETRY ERROR
                    </div>

                    <p className="np-text-[11px] np-leading-relaxed np-text-dark np-font-panel">
                        Failed to render 3D model. (Or your environment does not support showing 3D models!)
                    </p>
                </div>
            </div>
        )
    }
}

export default ModelErrorBoundary
