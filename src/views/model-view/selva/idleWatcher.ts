const STALE_PRESS_MS = 5_000

type IdleWatcherTargets = {
    window: EventTarget
    document: EventTarget & { visibilityState: DocumentVisibilityState }
    nextFrame: (callback: () => void) => void
}

export type IdleWatcher = {
    isBusy: () => boolean
    waitForIdle: () => Promise<void>
}

export const createIdleWatcher = ({ window: win, document: doc, nextFrame }: IdleWatcherTargets): IdleWatcher => {
    const pressed = new Set<number>()

    let waiters: (() => void)[] = []
    let watchdog: ReturnType<typeof setTimeout> | null = null

    const settle = () => {
        if (pressed.size > 0) {
            return
        }

        if (watchdog) {
            clearTimeout(watchdog)
            watchdog = null
        }

        if (waiters.length === 0) {
            return
        }

        nextFrame(() => {
            if (pressed.size > 0) {
                return
            }

            const ready = waiters
            waiters = []

            for (const resolve of ready) {
                resolve()
            }
        })
    }

    const releaseAll = () => {
        pressed.clear()
        settle()
    }

    const handlePointer = (event: Event) => {
        const { type, pointerId, buttons } = event as PointerEvent

        switch (type) {
            case 'pointerdown': {
                pressed.add(pointerId)
                break
            }
            case 'pointerup':
            case 'pointercancel': {
                pressed.delete(pointerId)
                break
            }
            case 'pointermove': {
                // Catches pointerup missed by this window
                if (buttons === 0) {
                    pressed.delete(pointerId)
                }
                break
            }
        }

        if (pressed.size === 0) {
            settle()
            return
        }

        if (watchdog) {
            clearTimeout(watchdog)
        }

        watchdog = setTimeout(releaseAll, STALE_PRESS_MS)
    }

    const handleVisibilityChange = () => {
        if (doc.visibilityState === 'hidden') {
            releaseAll()
        }
    }

    const options: AddEventListenerOptions = { capture: true, passive: true }

    for (const type of ['pointerdown', 'pointerup', 'pointercancel', 'pointermove']) {
        win.addEventListener(type, handlePointer, options)
    }

    win.addEventListener('blur', releaseAll, options)
    win.addEventListener('pagehide', releaseAll, options)
    doc.addEventListener('visibilitychange', handleVisibilityChange, options)

    return {
        isBusy: () => {
            return pressed.size > 0
        },
        waitForIdle: () => {
            if (pressed.size === 0) {
                return Promise.resolve()
            }

            return new Promise((resolve) => {
                waiters.push(resolve)
            })
        }
    }
}

let watcher: IdleWatcher | null = null

const getWatcher = (): IdleWatcher => {
    if (!watcher) {
        watcher = createIdleWatcher({
            window,
            document,
            nextFrame: (callback) => {
                requestAnimationFrame(callback)
            }
        })
    }

    return watcher
}

export const waitForIdle = (): Promise<void> => {
    return getWatcher().waitForIdle()
}

export const isPointerBusy = (): boolean => {
    return getWatcher().isBusy()
}
