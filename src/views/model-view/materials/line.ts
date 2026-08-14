import * as THREE from 'three'
import * as HEX from './colors'

export const DEFAULT = new THREE.LineBasicMaterial({
    color: HEX.RED,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1
})

export const SELECTED = new THREE.LineBasicMaterial({
    color: HEX.GREEN,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1
})

export const EXPIRED = new THREE.LineBasicMaterial({
    color: HEX.LIGHT
})

export const CONTEXT = new THREE.LineBasicMaterial({
    color: HEX.DARK
})

export const GRID = new THREE.LineBasicMaterial({
    color: HEX.DARKGREY,
    depthTest: true,
    depthWrite: false
})

// export const DEFAULT = {
//     color: HEX.RED,
// }

// export const SELECTED = {
//     color: HEX.GREEN,
// }

// export const EXPIRED = {
//     color: HEX.DARK,
//     opacity: 0.6
// }

// export const GRID = {
//     color: HEX.DARK,
//     opacity: 0.8
// }