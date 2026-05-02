import * as THREE from 'three'
import * as HEX from './colors'

export const DEFAULT = new THREE.LineBasicMaterial({
    color: HEX.RED,
})

export const SELECTED = new THREE.LineBasicMaterial({
    color: HEX.GREEN,
})

export const EXPIRED = new THREE.LineBasicMaterial({
    color: HEX.DARK,
    opacity: 0.6
})

export const GRID = new THREE.LineBasicMaterial({
    color: HEX.DARK,
    opacity: 0.8
})