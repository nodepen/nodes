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
            moving: true,
            state: 'idle' as GraphState,
            prev: 0,
            svgar: {} as SvgarCube,
        }
    },
    watch: {

    },
	created() {
        this.$store.dispatch('loadAllComponents');
        this.$store.dispatch('initializeGraph');

        (<any>this.$store.state.currentGraph).setCamera(0, 0, 50, 50);
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
        (<Graph>this.$store.state.currentGraph).graphObjects.forEach((x:any) => x.attachToComponent('pointerdown', this.test));
        this.svgar.listen();
    },
	computed: {
        svg(): string {
            const g = this.$store.state.currentGraph;

            return g.svg;
        }
    },
    methods: {
        test(event: PointerEvent): void {
            const id = (<Element>event.srcElement).id;
            this.state = 'movingComponent';
            const map: GlasshopperGraphMapping = this.$store.state.map;
            const component = map[id].component;

            console.log(component.name);
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

            if (this.state === 'movingCamera') {
                const svgarA = this.svgar.mapPageCoordinateToSvgarCoordinate(this.xa, this.ya);

                const dx = -(svgarB[0] - svgarA[0]);
                const dy = -(svgarB[1] - svgarA[1]);

                Update().svgar.cube(this.svgar).camera.withPan(dx, dy);
                this.$store.state.currentGraph.redraw(this.w, this.h);

                this.xa = this.xb;
                this.ya = this.yb;
            }

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