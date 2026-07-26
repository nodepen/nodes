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

export const CONTEXT = new THREE.MeshStandardMaterial({
    color: HEX.DARKGREY,
    side: THREE.DoubleSide,
    flatShading: false,
    opacity: 0.8
})

export const GHOSTED = new THREE.MeshStandardMaterial({
    color: HEX.DARK,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.05
})
