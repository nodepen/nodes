import * as THREE from 'three'
import * as HEX from './colors'

export const DEFAULT = new THREE.LineBasicMaterial({
    color: HEX.RED,
})

export const DARK = new THREE.LineBasicMaterial({
    color: HEX.DARK
})

export const SELECTED = new THREE.LineBasicMaterial({
    color: HEX.GREEN
})