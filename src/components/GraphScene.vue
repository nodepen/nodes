<template>
    <div 
    id="graph-scene"
    ref="three">
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import * as THREE from 'three';

export default Vue.extend({
    data() {
        return {

        }
    },
    created() {

    },
    mounted() {
        const el: Element = this.$refs.three as Element;
        const w = el.clientWidth;
        const h = el.clientHeight;

        const aspect = w / h;
        const frustumSize = 600;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color("white");

        const camera = new THREE.OrthographicCamera(-100, 100, 100, -100, 1, 1000 );
        camera.position.set(20, 20, 20)
        camera.lookAt(0, 0, 0)

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(w, h);
        renderer.setViewport( 0, 0, w, h );

        el.appendChild( renderer.domElement );

        const ground = new THREE.PlaneGeometry(25, 25);
        ground.rotateX(-90 * (Math.PI / 180));
        const groundMaterial = new THREE.MeshBasicMaterial( { color: new THREE.Color('gainsboro')});
        const plane = new THREE.Mesh( ground, groundMaterial );

        scene.add(plane);

        const geometry = new THREE.BoxGeometry(10, 10, 10);
        geometry.translate(0, 5.5, 0)
        const material = new THREE.MeshPhongMaterial( { 
            color: 0xffffff,
            polygonOffset: true,
            polygonOffsetFactor: 1,
            polygonOffsetUnits: 1 })
        const cube = new THREE.Mesh( geometry, material );
        const edges = new THREE.EdgesGeometry(geometry);
        const lines = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0x000000 }))

        scene.add(cube);
        scene.add(lines);

        const light = new THREE.AmbientLight( 0xffffff, 1 );
        // const light = new THREE.DirectionalLight(new THREE.Color('white'), 1);
        // light.position.set(-20, 20, -20);
        // light.target.position.set(0, 0, 0);
        // light.castShadow = true;

        scene.add(light);

        renderer.render( scene, camera );

        
    }
    
})
</script>

<style scoped>
#graph-scene {
	position: absolute;
	width: 100vw;
	height: 100vh;
    background: white;
	z-index: -15;
    touch-action: none;
}
</style>