<template>
    <div 
    id="graph" 
    ref="svgar" 
    v-html="svg"
    @pointerdown="onStartTrack"
    @pointermove="onTrack"
    @pointerup="onEndTrack">
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Update } from 'svgar';
import Resthopper from 'resthopper';
import SvgarCube from 'svgar/dist/models/SvgarCube';
import Graph from './../models/GlasshopperGraph';
import GlasshopperGraphMapping from '../models/GlasshopperGraphMapping';
import ResthopperComponent from 'resthopper/dist/models/ResthopperComponent';
import GlasshopperGraphObject from '../models/GlasshopperGraphObject';
import GlasshopperGraph from './../models/GlasshopperGraph';

type GraphState = 'idle' | 'movingCamera' | 'movingComponent' | 'drawingWire';

export default Vue.extend({
    data() {
        return {
            w: 0,
            h: 0,
            r: 25,
            xi: 0,
            yi: 0,
            xa: 0,
            ya: 0,
            xb: 0,
            yb: 0,
            movingObject: {} as GlasshopperGraphObject,
            state: 'idle' as GraphState,
            prev: 0,
            svgar: {} as SvgarCube,
            graph: {} as GlasshopperGraph,
        }
    },
    watch: {

    },
	created() {
        this.$store.dispatch('loadAllComponents');
        this.$store.dispatch('initializeGraph');

        this.graph = this.$store.state.currentGraph;

        this.graph.setCamera(0, 0, 50, 50);
	},
	mounted() {
		const el = <Element>this.$refs.svgar;
		this.w = el.clientWidth;
        this.h = el.clientHeight;

        if (this.h > this.w) {
            const graph: any = this.$store.state.currentGraph;
            graph.setCamera(0, 0, 20, 20);
            graph.svgar.flag('root');
        }
        
        const construct = Resthopper.ComponentIndex.createComponent('Construct Point');
        construct.position = {x: -4, y: 2}
        this.$store.dispatch('addGraphObject', construct);

        const deconstruct = Resthopper.ComponentIndex.createComponent('Deconstruct');
        deconstruct.position = {x: 11, y: -1}
        this.$store.dispatch('addGraphObject', deconstruct);

        this.$store.dispatch('redrawGraph', {w: this.w, h: this.h});

        this.svgar = this.$store.state.currentGraph.svgar;
    },
    updated() {
        (<Graph>this.$store.state.currentGraph).graphObjects.forEach((x:any) => x.attachToComponent('pointerdown', this.onStartMoveComponent));
        this.svgar.listen();
    },
	computed: {
        svg(): string {
            return this.graph.svgar.compile(this.w, this.h);
        }
    },
    methods: {
        onStartMoveComponent(event: PointerEvent): void {
            const id = (<Element>event.srcElement).id;
            this.state = 'movingComponent';
            const map: GlasshopperGraphMapping = this.$store.state.map;
            this.movingObject = map[id].object;
        },
        onStartTrack(event: PointerEvent): void {
            this.prev = Date.now();
            if (this.state === 'idle') {
                this.state = 'movingCamera';
            }

            const x = event.pageX;
            const y = event.pageY;
            const xs = this.svgar.mapPageCoordinateToSvgarCoordinate(x, y);

            this.xi = x;
            this.yi = y;
            this.xa = x;
            this.ya = y;
        },
        onTrack(event: PointerEvent): void {
            const time = Date.now();
            if (time - this.prev < this.r) {
                return;
            }

            event.preventDefault();

            const x = event.pageX;
            const y = event.pageY;

            this.xb = x;
            this.yb = y;

            const svgarB = this.svgar.mapPageCoordinateToSvgarCoordinate(this.xb, this.yb);
            const svgarA = this.svgar.mapPageCoordinateToSvgarCoordinate(this.xa, this.ya);
            const dx = -(svgarB[0] - svgarA[0]);
            const dy = -(svgarB[1] - svgarA[1]);


            if (this.state === 'movingCamera') {
                Update().svgar.cube(this.svgar).camera.withPan(dx, dy);
                this.$store.state.currentGraph.redraw(this.w, this.h);
            }
            if (this.state === 'movingComponent') {
                const c = this.movingObject.component;
                const start = c.position;
                c.position = {
                    x: start.x - dx,
                    y: start.y - dy,
                }
                this.movingObject.draw();
                //this.graph.redraw(this.w, this.h);
            }

            this.xa = this.xb;
            this.ya = this.yb;

            this.prev = time;
        },
        onEndTrack(event: PointerEvent): void {
            this.prev = 0;
            this.state = 'idle';
        },
        onStartWire(event: PointerEvent): void {

        }
    }
})
</script>

<style scoped>
#graph {
	position: absolute;
	width: 100vw;
	height: 100vh;
	z-index: -10;
    background: white;
    touch-action: none;
}

</style>