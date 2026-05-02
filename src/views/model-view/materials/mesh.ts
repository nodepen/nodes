import * as THREE from 'three'
import * as HEX from './colors'

export const DEFAULT = new THREE.MeshStandardMaterial({
    color: HEX.RED,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.6
})

export const SELECTED = new THREE.MeshStandardMaterial({
    color: HEX.GREEN,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.6
})

export const EXPIRED = new THREE.MeshStandardMaterial({
    color: HEX.DARK,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.15
})
