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
import ResthopperParameter from 'resthopper/dist/models/ResthopperParameter';

interface ClasshopperMapping {
    [svgarId: string]: {
        component: ResthopperComponent | undefined,
        parameter: ResthopperParameter | undefined,
    }
}

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
            map: {} as ClasshopperMapping,
        }
    },
    created() {
        const ci = Resthopper.ComponentIndex;
        const pi = Resthopper.ParameterIndex;

        let def = new Resthopper.Definition();

        const n = pi.createParameter("Number", 2);
        n.isUserInput = true;

        let pt = ci.createComponent("ConstructPoint");
        pt.position = { x: 0, y: 0 };
        pt.setInputByIndex(0, n);
        pt.setInputByIndex(1, n);
        pt.setInputByIndex(2, n);
        let point = pt.getOutputByIndex(0);

        let dept = ci.createComponent("Deconstruct");
        dept.position = { x: 15, y: 5 };
        dept.setInputByIndex(0, point!);
        let x = dept.getOutputByIndex(0);
        let y = dept.getOutputByIndex(1);

        let m = ci.createComponent("Multiplication");
        m.position = { x: 32, y: -3.5 };
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
        window.addEventListener('resize', this.resizeSvgar);

        //Update().svgar.cube(this.svgar).camera.extentsTo(-15, -20, 45, 20);
    },
    computed: {
        svg(): string {
            if (this.definition == undefined || (this.definition.components.length == 0 && this.definition.parameters.length == 0)) {
                return "";
            }

            this.svgar = this.convertDefinitionToSvgar(this.definition);

            if (this.w == 0 || this.h == 0) {
                return "";
            }

            return this.svgar.compile(this.w, this.h);
        }
    },
    watch: {
        svgar: function() {
            this.svgar.listen();
        }
    },
    methods: {
        onResize(): void {
            this.$nextTick(this.resizeSvgar);
        },
        resizeSvgar(): void {
            const canvas = (<Element>this.$refs.svgar);
            this.w = canvas.clientWidth;
            this.h = canvas.clientHeight;
            this.$forceUpdate;
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
                const a = this.svgar.mapPageCoordinateToSvgarCoordinate(this.px2, this.py2);
                const b = this.svgar.mapPageCoordinateToSvgarCoordinate(p[0], p[1]);

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

            const coords = this.svgar.mapPageCoordinateToSvgarCoordinate(p[0], p[1]);

            let dot = new SvgarSlab("dot");

            let circle = new Svgar.Builder.Circle(coords[0], coords[1], 0.5).build();

            dot.setAllGeometry([circle]);

            this.svgar.slabs.push(dot);
        },
        convertDefinitionToSvgar(d: ResthopperDefinition): SvgarCube {
            this.map = {};
            
            let dwg = new Svgar.Cube("resthopper");

            d.components.forEach(c => {
                dwg.slabs.push(this.drawComponent(c));
            });

            dwg.slabs.push(this.drawWires(d));

            if (this.svgar.scope) {
                dwg.scope = this.svgar.scope;
            }
            else {
                Update().svgar.cube(dwg).camera.extentsTo(-15, -20, 45, 20);
            }

            return dwg;
        },
        locateParameter(d: ResthopperDefinition, id: string): ResthopperParameter |  undefined {
            let param: ResthopperParameter | undefined = undefined;
            
            d.components.forEach(c => {
                Object.keys(c.output).forEach(out => {
                    let p = c.output[out];

                    if (p.instanceGuid == id) {
                        param = c.output[out];
                    }
                });
            });

            d.parameters.forEach(p => {
                if (p.instanceGuid == id) {
                    param = p;
                }
            })

            return param;
        },
        drawWires(c: ResthopperDefinition): SvgarSlab {
            let wireData: {
                a: {
                    x: number,
                    y: number
                },
                b: {
                    x: number,
                    y: number
                }
            }[] = [];

            c.components.forEach(component => {
                Object.keys(component.input).forEach(i => {
                    let p = component.input[i];

                    if (p.getSource()) {
                        const b = p.position;

                        let source = this.locateParameter(this.definition, p.getSource()!)

                        if (!source) {
                            return;
                        }

                        const a = source.position;

                        wireData.push({ a: { x: a.x, y: a.y }, b: { x: b.x, y: b.y } });
                    }
                })
            });

            const o = 1.5;

            let wires = new Svgar.Slab("wires");

            wireData.forEach(w => {
                let wire = new Svgar.Builder.Curve(w.a.x, w.a.y)
                .via(w.a.x + o, w.a.y)
                .through((w.a.x + w.b.x) / 2, (w.a.y + w.b.y) / 2 )
                .via(w.b.x - o, w.b.y)
                .through(w.b.x, w.b.y)
                .build();

                wires.addPath(wire);
            });

            wires.setAllStyles([
                {
                    name: "default",
                    attributes: {
                        "stroke": "#F4F4F4",
                        "stroke-width": "2px",
                        "fill": "none",
                    }
                }
            ]);

            wires.setElevation(-100);

            return wires;
        },
        drawComponent(c: ResthopperComponent): SvgarSlab {
            let cslab = new SvgarSlab(`${c.name}${c.guid.split("-")[0]}`);
            cslab.scaleStroke = true;

            const x = c.position.x;
            const y = c.position.y;

            let outline = new Svgar.Builder.Polyline(-5 + x, 2.5 + y)
            .lineTo(5 + x, 2.5 + y)
            .lineTo(5 + x, -2.5 + y)
            .lineTo(-5 + x, -2.5 + y)
            .close()
            .build();

            outline.setTag("outline");

            const so = 0.25;
            let shadow = new Svgar.Builder.Polyline(-5 - so + x, 2.5 - so + y)
            .lineTo(5 - so + x, 2.5 - so + y)
            .lineTo(5 - so + x, -2.5 - so + y)
            .lineTo(-5 - so + x, -2.5 - so + y)
            .close()
            .build();

            shadow.setTag("shadow");
            shadow.setElevation(-50);

            let icon = new Svgar.Builder.Polyline(-1 + x, -2.5 + y)
            .lineTo(-1 + x, 2.5 + y)
            .lineTo(1 + x, 2.5 + y)
            .lineTo(1 + x, -2.5 + y)
            .close()
            .build();

            icon.attach("mousedown", this.onClickComponent);
            icon.setTag("icon");
            icon.setElevation(-5);

            this.map[icon.getId()] = { component: c, parameter: undefined };

            cslab.setAllGeometry([
                outline,
                shadow,
                icon
            ]);

            cslab.setAllText([
                {
                    text: c.nickName.toLowerCase(),
                    tag: "title",
                    elevation: 5,
                    position: {
                        x: x,
                        y: y,
                    },
                }
            ]);

            const gs = 0.6;

            const numInputs = c.getInputCount();
            const step = 5 / numInputs;
            const inputs = Object.keys(c.input);
            
            for (let i = 0; i < numInputs; i++) {
                const st = i * step;

                c.input[inputs[i]].position = {
                    x: -5 + x,
                    y: 2.5 + y - st - (step / 2)
                }

                let panel = new Svgar.Builder.Polyline(-5 + x, 2.5 + y - st)
                .lineTo(x, 2.5 + y - st)
                .lineTo(x, 2.5 + y - st - step)
                .lineTo(-5 + x, 2.5 + y - st - step)
                .close()
                .build();

                panel.setTag("panel");
                panel.setElevation(-10);

                cslab.addPath(panel);

                let status = new Svgar.Builder.Polyline(-5 + x, 2.5 + y - st)
                .lineTo(-5 + gs + x, 2.5 + y - st)
                .lineTo(-5 + gs + x, 2.5 + y - st - step)
                .lineTo(-5 + x, 2.5 + y - st - step)
                .build();
                status.setTag(c.input[inputs[i]].isOptional ? "grip-empty" : "grip-warn");
                status.setElevation(-5);
                cslab.addPath(status);

                let grip = new Svgar.Builder.Circle(-5 + x, 2.5 + y - st - (step / 2), 0.3).build();
                grip.setTag("grip-empty");
                grip.setElevation(10);
                cslab.addPath(grip);
            }

            const numOutputs = c.getOutputCount();
            const ostep = 5 / numOutputs;
            const outputs = Object.keys(c.output);
            
            for (let i = 0; i < numOutputs; i++) {
                const st = i * ostep;

                c.output[outputs[i]].position = {
                    x: 5 + x,
                    y: 2.5 + y - st - (ostep / 2)
                }

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
                        "stroke": "#565656",
                        "stroke-width": "0.1px",
                        "fill": "none",
                    },
                },
                {
                    name: "whitefill",
                    attributes: {
                        "fill": "#565656",
                        "stroke": "none",
                        "stroke-width": "none",  
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
                        "fill": "#F4F4F4",
                        "stroke": "#565656",
                        "stroke-width": "0.1px",
                        "opacity": "0.95",
                    }
                },
                {
                    name: "panelwhite:hover",
                    attributes: {
                        "fill": "grey",
                        "cursor": "pointer"
                    }
                },
                {
                    name: "shadow",
                    attributes: {
                        "fill": "black",
                    }
                },
                {
                    name: "mainfont",
                    attributes: {
                        "font": "0.5px 'Major Mono Display'",
                        "font-weight": "bold",
                        "pointer-events": "none",
                        "user-select": "none",
                    }
                },
                {
                    name: "titlefont",
                    attributes: {
                        "font": "0.75px 'Major Mono Display'",
                        "font-weight": "bold",
                        "fill": "white",
                        "pointer-events": "none",
                        "user-select": "none",
                        "text-anchor": "middle",
                        "transform-origin": `${x}px ${y}px`,
                        "transform": `rotate(-0.25turn) translateX(${y * 2}px) translateY(0.2px)`
                    }
                },
                {
                    name: "red",
                    attributes: {
                        "fill": "#722323",
                        "stroke-width": "0.1px",
                        "stroke": "#565656"
                    }
                },
                {
                    name: "red:hover",
                    attributes: {
                        "cursor": "pointer",
                        "opacity": "0.8",
                    }
                },
                {
                    name: "orange",
                    attributes: {
                        "fill": "#F4B05D",
                        "stroke-width": "0.1px",
                        "stroke": "#565656"
                    }
                },
                {
                    name: "orange:hover",
                    attributes: {
                        "cursor": "pointer",
                        "opacity": "0.8",
                    }
                },
                {
                    name: "empty",
                    attributes: {
                        "fill": "#F4F4F4",
                        "stroke-width": "0.1px",
                        "stroke": "#565656"
                    }
                },
                {
                    name: "empty:hover",
                    attributes: {
                        "cursor": "pointer",
                        "fill": "grey",
                    }
                },
                
            ]);

            cslab.setAllStates([
                {
                    name: "default",
                    styles: {
                        "outline": "whitenofill",
                        "icon": "whitefill",
                        "panel": "panelwhite",
                        "grip": "panelwhite",
                        "text": "mainfont",
                        "title": "titlefont",
                        "shadow": "shadow",
                        "grip-invalid": "red",
                        "grip-warn": "orange",
                        "grip-empty": "empty"
                    }
                }
            ]);

            return cslab;
        },
        onClickComponent(event: MouseEvent): void {
            console.log(this.map[(<Element>event.srcElement!).id].component!.name);
        }
    }
})
</script>