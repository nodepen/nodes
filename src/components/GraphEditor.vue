<template>
    <div 
    tabindex="0"
    id="graph" 
    ref="svgar" 
    v-html="svg"
    @pointerdown="onStartTrack"
    @pointermove="onTrack"
    @pointerup="onEndTrack"
    @keydown="onKeyDown"
    @keyup="onKeyUp"
    @contextmenu.prevent>
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

type GraphState = 'idle' | 'movingCamera' | 'movingComponent' | 'selectingComponent' | 'drawingWire';

type Command = 'none' | 'copy' | 'delete'

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
            keyCache: [] as string[],
            movingObject: {} as GlasshopperGraphObject,
            selectedObject: '',
            state: 'idle' as GraphState,
            start: 0,
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
            let graph = this.$store.state.currentGraph;
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
        this.graph.graphObjects.forEach((x:any) => {
            x.attachToComponent('pointerdown', this.onStartMoveComponent);
            x.attachToComponent('pointerup', this.onSelectComponent);
            x.attachToParameter('pointerup', this.test);
        });
        this.svgar.listen();
    },
	computed: {
        svg(): string {
            return this.graph.svgar.compile(this.w, this.h);
        },
        selected(): GlasshopperGraphObject | undefined {
            return this.graph.graphObjects.find(x => x.guid === this.selectedObject);
        }
    },
    methods: {
        test(event: PointerEvent): void {
            console.log(this.$store.state.map[(<Element>event.srcElement).id]);
        },
        stop(): boolean {
            return false
        },
        onKeyDown(event: KeyboardEvent): void {
            this.keyCache.push(event.code);
        },
        onKeyUp(event: KeyboardEvent): void {

            switch(this.determineCommand(event.code)) {
                case 'copy':
                    console.log('run copy');
                    break;
                case 'delete':
                    console.log('run delete');
                    break;
                case 'none':
                    console.log('do nothing');
                    break;
            }

            this.keyCache = this.keyCache.filter(x => x != event.code);
        },
        determineCommand(code: string): Command {
            if (code === 'KeyC') {
                if (this.keyCache.includes('ControlLeft')) {
                    return 'copy';
                }
            }

            if (code === 'Delete') {
                return'delete';
            }

            return 'none';
        },
        onStartMoveComponent(event: PointerEvent): void {
            const id = (<Element>event.srcElement).id;
            this.state = 'movingComponent';
            const map: GlasshopperGraphMapping = this.$store.state.map;
            this.movingObject = map[id].object;
        },
        onSelectComponent(event: PointerEvent): void {
            const now = Date.now();

            const id = (<Element>event.srcElement).id;
            const map: GlasshopperGraphMapping = this.$store.state.map;
            const object = map[id].object;

            if (now - this.start > 200) {
                return;
            }

            this.selectedObject = this.selectedObject === object.guid ? '' : object.guid;

            this.state = 'selectingComponent';
            object.state = 'selected';
            object.svgar.setElevation(10);
            object.svgar.setCurrentState('selected');
            object.svgar.compile();
            
        },
        onStartTrack(event: PointerEvent): void {
            this.start = Date.now();
            this.prev = this.start;
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
                this.movingObject.draw(this.movingObject.state);
            }

            this.xa = this.xb;
            this.ya = this.yb;

            this.prev = time;
        },
        onEndTrack(event: PointerEvent): void {
            const t = Date.now();

            if (t - this.prev < 100 && Math.abs(this.xa - this.xi) < 5 && Math.abs(this.ya - this.yi) < 5 && this.state != 'selectingComponent') {
                this.selectedObject = '';
            }

            this.prev = 0;

            this.graph.graphObjects.filter(x => x.state === 'selected' && this.selectedObject != x.guid).forEach(x => {
                x.state = 'visible';
                x.svgar.setElevation(0);
                x.svgar.setCurrentState('default');
                x.svgar.compile();
            });

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

#graph:focus {
    outline: none;
}

</style>