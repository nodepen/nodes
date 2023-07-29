import type React from 'react'
import { useEffect } from 'react'

type EventKey<T extends HTMLElement | SVGElement> = T extends HTMLElement
  ? keyof HTMLElementEventMap
  : keyof SVGElementEventMap

type EventHandler<T extends HTMLElement | SVGElement, U extends EventKey<T>> = T extends HTMLElement
  ? (event: HTMLElementEventMap[U]) => void
  : (event: SVGElementEventMap[U]) => void

/**
 * Utility function for imperatively keeping an event handler attached to the provided DOM element ref.
 */
export const useImperativeEvent = <T extends HTMLElement | SVGElement, U extends EventKey<T>>(
  ref: React.RefObject<T>,
  eventName: U,
  eventHandler: EventHandler<T, U>,
  isActive = true,
  capture = false
): void => {
  useEffect(() => {
    const element = ref.current

    if (!element) {
      return
    }

    if (!isActive) {
      return
    }

    element.addEventListener(eventName, eventHandler as EventListener, { capture: capture })

    return () => {
      element.removeEventListener(eventName, eventHandler as EventListener, { capture: capture })
    }
  }, [eventHandler, isActive])
}
