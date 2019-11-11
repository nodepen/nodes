<template>
<div id="workspace">
    <div 
    class="svgar" 
    ref="svgar" 
    v-html="svg"
    @mousedown="onStartTrack"
    @mousemove="onTrack"
    @mouseup="onStopTrack">
    </div>
</div>
</template>

<style scoped>
#workspace {
    width: 100%;
    height: 100%;
}

.svgar {
    width: 100%;
    height: 100%;
}

.svgar:hover {
    cursor: move;
}
</style>

<script lang="ts">
import Vue from 'vue'
import Resthopper from 'resthopper';
import Svgar, { Update } from 'svgar';
import SvgarCube from 'svgar/dist/models/SvgarCube';
import ResthopperComponent from 'resthopper/dist/models/ResthopperComponent';
import ResthopperDefinition from 'resthopper/dist/models/ResthopperDefinition';
import SvgarSlab from 'svgar/dist/models/SvgarSlab';

type CanvasState = "idle" | "panning" | "movingComponent" | "drawingWire";

export default Vue.extend({
    name: 'workspace',
    data() {
        return {
            w: 0,
            h: 0,
            state: "idle" as CanvasState,
            start: 0,
            prev: 0,
            px: 0,
            py: 0,
            px2: 0,
            py2: 0,
            dx: 0,
            dy: 0,
            svgar: {} as SvgarCube,
            definition: {} as ResthopperDefinition,
        }
    },
    created() {
        const ci = Resthopper.ComponentIndex;
        const pi = Resthopper.ParameterIndex;

        let def = new Resthopper.Definition();

        let t = new Resthopper.Component();

        const n = pi.createParameter("Number", 2);
        n.isUserInput = true;

        let pt = ci.createComponent("ConstructPoint");
        pt.setInputByIndex(0, n);
        pt.setInputByIndex(1, n);
        pt.setInputByIndex(2, n);
        let point = pt.getOutputByIndex(0);

        let dept = ci.createComponent("Deconstruct");
        dept.setInputByIndex(0, point!);
        let x = dept.getOutputByIndex(0);
        let y = dept.getOutputByIndex(1);

        let m = ci.createComponent("Multiplication");
        m.setInputByIndex(0, x!);
        m.setInputByIndex(1, y!);
        let result = m.getOutputByIndex(0);

        let out = pi.createParameter("Number");
        out.isUserOutput = true;
        out.setSource(result!);

        def.parameters = [n, out];
        def.components = [pt, dept, m];

        this.definition = def;

        //console.log(def.compile());
        //console.log(JSON.stringify(def.toRequest()));

        // this.$http.post(`http://localhost:8081/grasshopper`, JSON.stringify(def.toRequest()))
        // .then(x => {
        //     console.log(Resthopper.Parse.ResthopperSchemaAsOutputValue(x.data));
        // })
        // .catch(err => {
        //     console.log(err)
        // });
    },
    mounted() {
        this.resizeSvgar();
        window.addEventListener('resize', this.onResize);

        let defaultCanvas = new Svgar.Cube("resthopper");

        let testComponent = this.drawComponent(this.definition.components[0], 0, 0);

        defaultCanvas.slabs = [testComponent];
        Update().svgar.cube(defaultCanvas).camera.extentsTo(-12, -12, 8, 8);

        this.svgar = defaultCanvas;
    },
    computed: {
        svg(): string {
            if (this.w == 0 || this.h == 0) {
                return "";
            }

            return this.svgar.compile(this.w, this.h);
        }
    },
    methods: {
        mapPageCoordinateToSvgarCoordinate(pageX: number, pageY: number): number[] {
            const svgarRect = (<Element>this.$refs.svgar).getBoundingClientRect();
            const nX = (pageX - svgarRect.left) / (svgarRect.right - svgarRect.left);
            const nY = (pageY - svgarRect.top) / (svgarRect.bottom - svgarRect.top);

            const c = this.svgar.scope;
            let xDomain = c.maximum[0] - c.minimum[0];
            let yDomain = c.maximum[1] - c.minimum[1];

            const xMod = yDomain > xDomain ? (1 / yDomain) * xDomain : 1;
            const yMod = xDomain > yDomain ? (1 / xDomain) * yDomain : 1;

            const denominator = Math.min(...[this.w, this.h]);
            const pX = this.w / denominator;
            const pY = this.h / denominator;

            const xMult = pX / xMod;
            const yMult = pY / yMod;

            const xDelta = ((xDomain * xMult) - xDomain) / 2;
            const yDelta = ((yDomain * yMult) - yDomain) / 2;

            const svgarXExtents = [c.minimum[0] - xDelta, c.maximum[0] + xDelta];
            const svgarYExtents = [c.minimum[1] - yDelta, c.maximum[1] + yDelta];

            const svgarXDomain = svgarXExtents[1] - svgarXExtents[0];
            const svgarYDomain = svgarYExtents[1] - svgarYExtents[0];

            const svgarX = (nX * svgarXDomain) + svgarXExtents[0];
            const svgarY = svgarYDomain - ((nY * svgarYDomain) - svgarYExtents[0]);
            
            return [svgarX, svgarY];
        },
        onResize(): void {
            this.resizeSvgar();
        },
        resizeSvgar(): void {
            const canvas = (<Element>this.$refs.svgar);
            this.w = canvas.clientWidth;
            this.h = canvas.clientHeight;
        },
        onStartTrack(event: MouseEvent): void {
            this.start = Date.now();
            this.px = event.pageX;
            this.py = event.pageY;
            this.px2 = event.pageX;
            this.py2 = event.pageY;

            this.state = "panning";
            //console.log(this.mapPageCoordinateToSvgarCoordinate(event.pageX, event.pageY));
        },
        onTrack(event: MouseEvent): void {
            if (Date.now() - this.prev < 25) {
                return;
            }

            if(this.state == 'panning') {
                const a = this.mapPageCoordinateToSvgarCoordinate(this.px2, this.py2);
                const b = this.mapPageCoordinateToSvgarCoordinate(event.pageX, event.pageY);

                Update().svgar.cube(this.svgar).camera.withPan(-(b[0] - a[0]), -(b[1] - a[1]));

                this.px2 = event.pageX;
                this.py2 = event.pageY;
            }

            this.prev = Date.now();
        },
        onStopTrack(event: MouseEvent): void {
            if (Date.now() - this.start < 250) {
                this.addTestDot(event);
            }

            this.px = 0;
            this.py = 0;

            this.state = 'idle';
        },
        addTestDot(event: MouseEvent): void {
            const coords = this.mapPageCoordinateToSvgarCoordinate(event.pageX, event.pageY);

            let dot = new SvgarSlab("dot");

            let circle = new Svgar.Builder.Circle(coords[0], coords[1], 0.5).build();

            dot.setAllGeometry([circle]);

            this.svgar.slabs.push(dot);
        },
        drawComponent(c: ResthopperComponent, x: number, y: number): SvgarSlab {
            let cslab = new SvgarSlab(`${c.name}${c.guid.split("-")[0]}`);

            let outline = new Svgar.Builder.Polyline(-5 + x, 2.5 + y)
            .lineTo(5 + x, 2.5 + y)
            .lineTo(5 + x, -2.5 + y)
            .lineTo(-5 + x, -2.5 + y)
            .close()
            .build();

            outline.setTag("outline");

            cslab.setAllGeometry([
                outline
            ]);

            cslab.setAllStyles([
                {
                    name: "whitenofill",
                    attributes: {
                        "stroke": "#cccccc",
                        "stroke-width": "0.5mm",
                        "fill": "none",
                    }
                },
            ]);

            cslab.setAllStates([
                {
                    name: "default",
                    styles: {
                        "outline": "whitenofill",
                    }
                }
            ]);

            return cslab;
        }
    }
})
</script>