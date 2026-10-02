import * as THREE from 'three'
import * as HEX from './colors'

export const SELECTED = new THREE.LineBasicMaterial({
    color: HEX.GREEN,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1
})

export const CONTEXT = new THREE.LineBasicMaterial({
    color: HEX.DARK
})
