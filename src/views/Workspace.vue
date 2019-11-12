<template>
<div id="workspace">
    <div 
    class="svgar" 
    ref="svgar" 
    v-html="svg"
    @mousedown="onStartTrack"
    @mousemove="onTrack"
    @mouseup="onStopTrack"
    @mouseleave="onStopTrack"
    @touchstart="onStartTrack"
    @touchmove="onTrack"
    @pointermove="onTrack"
    @touchend="onStopTrack">
    </div>
    <div class="overlay__tools">
    </div>
    <div class="overlay__info">
        <div class="overlay__info__title">
            <div class="overlay__text--lg">list item</div>
        </div>
        <div class="overlay__info__subtitle">
            <span class="overlay__text--md">sets &gt; lists</span>
        </div>
        <div>
            something
        </div>
    </div>
</div>
</template>

<style scoped>
#workspace {
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    flex-wrap: wrap;
}

.overlay__tools {
    flex-grow: 1;
}

.overlay__info {
    width: 400px;
    max-width: calc(100vw - var(--lg) - var(--md) - var(--md));
    height: 100%;

    pointer-events: none;

    box-sizing: border-box;
    z-index: 100;

    padding: var(--md);

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
}

.overlay__info__title {
    width: 100%;
    height: var(--lg);
    box-sizing: border-box;
    line-height: var(--lg);
    vertical-align: middle;

}

.overlay__info__subtitle {
    width: 100%;
    height: var(--md);
    padding-bottom: var(--md);
    margin-bottom: var(--md);

    line-height: var(--md);
    vertical-align: middle;
}

.overlay__text--lg {
    font-size: calc(1.75 * var(--md));
    color: white;

    transform: translateY(-0.1rem);
}

.overlay__text--md {
    font-size: var(--md);
    color: white;
}

.svgar {
    position: absolute;
    left: calc(var(--lg) + var(--md) + var(--md));
    width: calc(100vw - var(--lg) - var(--md) - var(--md));
    height: 100vh;
    touch-action: none;
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

interface ClasshopperComponent {
    component: ResthopperComponent,
    position: {
        x: number,
        y: number,
    }
    inputGrips: {
        x: number,
        y: number,
    }[],
    outputGrips: {
        x: number,
        y: number,
    }[]
}

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

        let cA = this.drawComponent(this.definition.components[0], 0, 0);
        let cB = this.drawComponent(this.definition.components[1], 15, 0);
        let cC = this.drawComponent(this.definition.components[2], 30, 0);

        defaultCanvas.slabs = [cA, cB, cC];
        Update().svgar.cube(defaultCanvas).camera.extentsTo(-15, -20, 45, 20);

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
            // Get normalized coordinate locations on html element
            const svgarRect = (<Element>this.$refs.svgar).getBoundingClientRect();
            const nX = (pageX - svgarRect.left) / (svgarRect.right - svgarRect.left);
            const nY = (pageY - svgarRect.top) / (svgarRect.bottom - svgarRect.top);

            // Compare page div proportion to svgar camera proportion
            const camera = this.svgar.scope;
            const svgarXDomain = camera.maximum[0] - camera.minimum[0];
            const svgarYDomain = camera.maximum[1] - camera.minimum[1];

            const svgarProportion = svgarXDomain / svgarYDomain;

            const pageXDomain = svgarRect.right - svgarRect.left;
            const pageYDomain = svgarRect.bottom - svgarRect.top;

            const pageProportion = pageXDomain / pageYDomain;

            // Calculate svgar domain modifiers based on relative proportions
            const xModifier = pageProportion > svgarProportion 
                ? (pageXDomain / svgarXDomain) * (svgarYDomain / pageYDomain)
                : 1;
            const yModifier = pageProportion < svgarProportion
                ? (pageYDomain / svgarYDomain) * (svgarXDomain / pageXDomain)
                : 1;

            // Calculate visible svgar extents
            // ( Chuck ) This process is necessary given how svg renders a viewBox with different proportions than the parent div
            interface SvgarExtents {
                x: {
                    min: number,
                    max: number
                },
                y: {
                    min: number,
                    max: number
                }
            }

            const deltaX = ((svgarXDomain * xModifier) - svgarXDomain) / 2;
            const deltaY = ((svgarYDomain * yModifier) - svgarYDomain) / 2;

            const visibleSvgarExtents: SvgarExtents = {
                x: {
                    min: camera.minimum[0] - deltaX,
                    max: camera.maximum[0] + deltaX
                },
                y: {
                    min: camera.minimum[1] - deltaY,
                    max: camera.maximum[1] + deltaY
                }
            }

            const visibleSvgarXDomain = visibleSvgarExtents.x.max - visibleSvgarExtents.x.min;
            const visibleSvgarYDomain = visibleSvgarExtents.y.max - visibleSvgarExtents.y.min;

            // Map normalized coordinates to calculated visible svgar domain
            const svgarX = (nX * visibleSvgarXDomain) + visibleSvgarExtents.x.min;
            const svgarY = visibleSvgarYDomain - ((nY * visibleSvgarYDomain) - visibleSvgarExtents.y.min);
            
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
        touchOrMouseCoordinates(event: MouseEvent | TouchEvent | PointerEvent): number[] {
            if (event instanceof MouseEvent || event instanceof PointerEvent) {
                return [event.pageX, event.pageY];
            }
            else {
                let x: number[] = [];
                let y: number[] = [];

                for(let i = 0; i < event.touches.length; i++) {
                    x.push(event.touches[i].pageX);
                    y.push(event.touches[i].pageY);
                }

                return [x[0], y[0]];
            }
        },
        onStartTrack(event: MouseEvent | TouchEvent): void {
            this.start = Date.now();

            let p = this.touchOrMouseCoordinates(event);

            this.px = p[0];
            this.py = p[1];
            this.px2 = p[0];
            this.py2 = p[1];

            this.state = "panning";
            //console.log(this.mapPageCoordinateToSvgarCoordinate(event.pageX, event.pageY));
        },
        onTrack(event: MouseEvent | TouchEvent | PointerEvent): void {
            if (Date.now() - this.prev < 25) {
                return;
            }

            if (event instanceof PointerEvent && !event.isPrimary) {
                return;
            }

            let p = this.touchOrMouseCoordinates(event);

            if (event instanceof TouchEvent) {
                event.stopImmediatePropagation();
            }

            if (this.state == 'panning') {
                const a = this.mapPageCoordinateToSvgarCoordinate(this.px2, this.py2);
                const b = this.mapPageCoordinateToSvgarCoordinate(p[0], p[1]);

                Update().svgar.cube(this.svgar).camera.withPan(-(b[0] - a[0]), -(b[1] - a[1]));

                this.px2 = p[0];
                this.py2 = p[1];
            }

            this.prev = Date.now();
        },
        onStopTrack(event: MouseEvent | TouchEvent): void {
            if (Date.now() - this.start < 250) {
                this.addTestDot(event);
            }

            console.log("stopped...")

            this.px = 0;
            this.py = 0;

            this.state = 'idle';
        },
        onScroll(event: any): void {
            console.log(event);
        },
        addTestDot(event: MouseEvent | TouchEvent): void {
            const p = this.touchOrMouseCoordinates(event);

            const coords = this.mapPageCoordinateToSvgarCoordinate(p[0], p[1]);

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

            let icon = new Svgar.Builder.Polyline(-1 + x, -1 + y)
            .lineTo(-1 + x, 1 + y)
            .lineTo(1 + x, 1 + y)
            .lineTo(1 + x, -1 + y)
            .close()
            .build();

            icon.setTag("icon");

            cslab.setAllGeometry([
                outline,
                icon
            ]);

            const numInputs = c.getInputCount();
            const step = 5 / numInputs;
            const inputs = Object.keys(c.input);
            
            for (let i = 0; i < numInputs; i++) {
                const st = i * step;

                let panel = new Svgar.Builder.Polyline(-5 + x, 2.5 + y - st)
                .lineTo(x, 2.5 + y - st)
                .lineTo(x, 2.5 + y - st - step)
                .lineTo(-5 + x, 2.5 + y - st - step)
                .close()
                .build();

                panel.setTag("panel");
                panel.setElevation(-10);

                cslab.addPath(panel);

                let grip = new Svgar.Builder.Circle(-5 + x, 2.5 + y - st - (step / 2), 0.3).build();
                grip.setTag("grip");
                cslab.addPath(grip);
            }

            const numOutputs = c.getOutputCount();
            const ostep = 5 / numOutputs;
            const outputs = Object.keys(c.output);
            
            for (let i = 0; i < numOutputs; i++) {
                const st = i * ostep;

                let panel = new Svgar.Builder.Polyline(5 + x, 2.5 + y - st)
                .lineTo(x, 2.5 + y - st)
                .lineTo(x, 2.5 + y - st - ostep)
                .lineTo(5 + x, 2.5 + y - st - ostep)
                .close()
                .build();

                panel.setTag("panel");
                panel.setElevation(-10);

                cslab.addPath(panel);

                let grip = new Svgar.Builder.Circle(5 + x, 2.5 + y - st - (ostep / 2), 0.3).build();
                grip.setTag("grip");
                cslab.addPath(grip);
            }
            

            cslab.setAllStyles([
                {
                    name: "whitenofill",
                    attributes: {
                        "stroke": "#cccccc",
                        "stroke-width": "0.5mm",
                        "fill": "none",
                    },
                },
                {
                    name: "whitefill",
                    attributes: {
                        "stroke": "none",
                        "stroke-width": "none",
                        "fill": "#cccccc",
                    }
                },
                {
                    name: "whitefill:hover",
                    attributes: {
                        "fill": "grey",
                        "cursor": "pointer",
                    }
                },
                {
                    name: "panelwhite",
                    attributes: {
                        "fill": "white",
                        "stroke": "#cccccc",
                        "stroke-width": "0.2mm",
                        "opacity": "0.95",
                    }
                },
                {
                    name: "panelwhite:hover",
                    attributes: {
                        "fill": "grey",
                        "cursor": "pointer"
                    }
                }
            ]);

            cslab.setAllStates([
                {
                    name: "default",
                    styles: {
                        "outline": "whitenofill",
                        "icon": "whitefill",
                        "panel": "panelwhite",
                        "grip": "whitefill",
                    }
                }
            ]);

            return cslab;
        }
    }
})
</script>