import React from 'react'
import type { WireEditMode } from '@/types'

export const getWireEditIcon = (mode: WireEditMode) => {
  switch (mode) {
    case 'set': {
      return (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M24.5711 18.1213L28.6067 22.1569C28.9972 22.5474 28.9972 23.1806 28.6067 23.5711L24.5711 27.6066C23.9412 28.2366 22.864 27.7904 22.864 26.8995L22.864 18.8284C22.864 17.9375 23.9412 17.4914 24.5711 18.1213Z"
            stroke="#333333"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line x1="22" y1="23" x2="12" y2="23" stroke="#333333" strokeWidth="2" strokeLinecap="round" />
          <path d="M8 18V21C8 22.1046 8.89543 23 10 23H13" stroke="#333333" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    }
    case 'merge': {
      return (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M24.5711 18.1213L28.6067 22.1569C28.9972 22.5474 28.9972 23.1806 28.6067 23.5711L24.5711 27.6066C23.9412 28.2366 22.864 27.7904 22.864 26.8995L22.864 18.8284C22.864 17.9375 23.9412 17.4914 24.5711 18.1213Z"
            fill="#98E2C6"
            stroke="#333333"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line x1="22" y1="23" x2="12" y2="23" stroke="#333333" strokeWidth="2" strokeLinecap="round" />
          <line x1="22" y1="10" x2="14" y2="10" stroke="#333333" strokeWidth="2" strokeLinecap="round" />
          <line x1="18" y1="14" x2="18" y2="6" stroke="#333333" strokeWidth="2" strokeLinecap="round" />
          <path d="M8 18V21C8 22.1046 8.89543 23 10 23H13" stroke="#333333" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    }
    case 'remove': {
      return (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M24.5711 18.1213L28.6067 22.1569C28.9972 22.5474 28.9972 23.1806 28.6067 23.5711L24.5711 27.6066C23.9412 28.2366 22.864 27.7904 22.864 26.8995L22.864 18.8284C22.864 17.9375 23.9412 17.4914 24.5711 18.1213Z"
            fill="#EB5757"
            stroke="#333333"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line x1="22" y1="23" x2="12" y2="23" stroke="#333333" strokeWidth="2" strokeLinecap="round" />
          <line x1="22" y1="10" x2="14" y2="10" stroke="#333333" strokeWidth="2" strokeLinecap="round" />
          <path d="M8 18V21C8 22.1046 8.89543 23 10 23H13" stroke="#333333" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    }
    case 'move': {
      return (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M24.5711 18.6214L28.6067 22.6569C28.9972 23.0474 28.9972 23.6806 28.6067 24.0711L24.5711 28.1067C23.9412 28.7366 22.864 28.2905 22.864 27.3996L22.864 19.3285C22.864 18.4376 23.9412 17.9914 24.5711 18.6214Z"
            stroke="#333333"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line x1="22" y1="23.5001" x2="11" y2="23.5001" stroke="#333333" strokeWidth="2" strokeLinecap="round" />
          <path
            d="M11 29.5001C9.34315 29.5001 8 28.1569 8 26.5001C8 24.8432 9.34315 23.5001 11 23.5001"
            stroke="#333333"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M18 10.5001L16.9142 9.41427C16.1332 8.63323 14.8668 8.63323 14.0858 9.41427L13 10.5001"
            stroke="#333333"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M18 10.5L19.0858 11.5858C19.8668 12.3669 21.1332 12.3669 21.9142 11.5858L23 10.5"
            stroke="#333333"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      )
    }
  }
}
