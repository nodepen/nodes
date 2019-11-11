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
            px: 0,
            py: 0,
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

        let testComponent = this.drawComponent(this.definition.components[0]);

        defaultCanvas.slabs = [testComponent];
        Update().svgar.cube(defaultCanvas).camera.extentsTo(-12, -8, 8, 12);

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
            const aX = (c.maximum[0] + c.minimum[0]) / 2;
            const aY = (c.maximum[1] + c.minimum[1]) / 2;
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

            const svgarX = (nX * svgarXDomain) + svgarXExtents[0] + aX;
            const svgarY = (nY * svgarYDomain) + svgarYExtents[0] + aY;

            return [svgarX, -svgarY];
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
            console.log(this.mapPageCoordinateToSvgarCoordinate(event.pageX, event.pageY));
        },
        onTrack(event: MouseEvent): void {

        },
        onStopTrack(event: MouseEvent): void {

        },
        drawComponent(c: ResthopperComponent): SvgarSlab {
            let cslab = new SvgarSlab(`${c.name}${c.guid.split("-")[0]}`);

            let outline = new Svgar.Builder.Polyline(-5, 2.5)
            .lineTo(5, 2.5)
            .lineTo(5, -2.5)
            .lineTo(-5, -2.5)
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