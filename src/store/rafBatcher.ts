import { useStore } from './store'
import type { NodesAppState } from './state'

type Updater = (state: NodesAppState) => void

type PendingEntry = {
    update: Updater
    /** Runs once, after every scheduled `update` for the frame has applied. */
    after?: Updater
}

const pending = new Map<string, PendingEntry>()
let rafId: number | null = null

const flush = (): void => {
    rafId = null

    if (pending.size === 0) {
        return
    }

    const entries = [...pending.values()]
    pending.clear()

    useStore.getState().dispatch.apply((state) => {
        for (const entry of entries) {
            entry.update(state)
        }
        for (const entry of entries) {
            entry.after?.(state)
        }
    })
}

// Batch operations by key, replacing calls within a frame
export const rafBatcher = {
    schedule(key: string, update: Updater, after?: Updater): void {
        pending.set(key, { update, after })

        if (rafId === null) {
            rafId = requestAnimationFrame(flush)
        }
    },
    /** Drop a pending update for `key` without flushing it (e.g. on pointerup/unmount). */
    cancel(key: string): void {
        pending.delete(key)
    },
    /** Force any pending updates to apply synchronously right now. */
    flushSync(): void {
        if (rafId !== null) {
            cancelAnimationFrame(rafId)
        }
        flush()
    },
}
