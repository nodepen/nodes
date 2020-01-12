<template>
    <div 
    id="graph-scene"
    ref="three">
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import * as THREE from 'three';
import GlasshopperGraphObject from '../models/GlasshopperGraphObject';
import { GH_Box, GH_Point } from './../models/geometry/GrasshopperGeometry';

export default Vue.extend({
    data() {
        return {
            scene: {} as any,
            camera: {} as any,
            renderer: {} as any,
        }
    },
    computed: {
        visibleGeometry(): { index: number, type: string, value: any }[] {
            const objects: GlasshopperGraphObject[] = this.$store.state.currentGraph.graphObjects;
            if (objects === undefined) {
                return [];
            }
            const geo: { index: number, type: string, value: any }[] = [];
            objects.forEach(o => {
                o.getOutputCacheValues().forEach(x => {
                    if (x.type !== 'GH_Number') {
                        geo.push(x);
                    }
                });
            });
            return geo;
        }
    },
    watch: {
        visibleGeometry(): void {
            this.resetScene();
            const s = this.scene;

            // Add geometry representations based on their rhino type
            this.visibleGeometry.forEach(x => {
                switch(x.type) {
                    case 'GH_Box':
                        const box = x.value as GH_Box;
                        break;
                    case 'GH_Point':
                        const pt = x.value as GH_Point;
                        const sphereGeometry = new THREE.SphereGeometry(0.5);
                        sphereGeometry.translate(pt.X, pt.Z, -pt.Y);
                        const sphereMaterial = new THREE.MeshBasicMaterial(
                            { color: 0x000000 }
                        );
                        const sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
                        s.add(sphere);

                        // const edges = new THREE.EdgesGeometry(sphereGeometry);
                        // const outline = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0xffffff }));
                        // s.add(outline);

                        break;
                    default:
                        break;
                }
            });

            this.renderer.render( this.scene, this.camera );
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
        this.scene = scene;

        const s = 40;
        const camera = new THREE.OrthographicCamera(-s * aspect, s * aspect, s, -s, 1, 1000 );
        camera.position.set(25, 15, 20);
        camera.lookAt(0, 0, 0);
        this.camera = camera;

        const renderer = new THREE.WebGLRenderer();
        this.renderer = renderer;
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

        
    },
    methods: {
        resetScene(): void {
            const scene = new THREE.Scene();
            scene.background = new THREE.Color("white");
            
            const ground = new THREE.PlaneGeometry(25, 25);
            ground.rotateX(-90 * (Math.PI / 180));
            const groundMaterial = new THREE.MeshBasicMaterial( { 
                color: 0x000000,
                opacity: 0.2,
                transparent: true
                });
            const plane = new THREE.Mesh( ground, groundMaterial );
            scene.add(plane);

            const light = new THREE.AmbientLight( 0xffffff, 1 );
            scene.add(light);
            
            this.scene = scene;
        }
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