<template>
<div @keyup.space="onRequestOutput" id="workspace">
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
        <workspace-overlay v-if="activeComponent != undefined && activeComponent != {}" :component="activeComponent"></workspace-overlay>
    </div>
    <div v-if="placing" class="component_placer" :style="{ left: placerX - 125 + 'px', top: placerY + 'px' }">
        <input 
        ref="newc" 
        @keyup.enter="onSubmitComponent" 
        v-model="candidate" 
        type='text' 
        name='componentname' 
        placeholder="type component name here..."
        autocomplete="off" />
    <div @click="onSelectComponentOrParam(c)" class="component_placer__suggestions" v-show="candidate.length > 3" v-for="(c, index) in closeMatches" :key="c.nickName + index" >
        <div class="component_placer__suggestions__name">
            {{c.name.toLowerCase()}}
        </div>
        <div class="component_placer__suggestions__info">
            <div v-if="isResthopperParameter(c)">param</div>
            <span v-else>{{c.category.toLowerCase()}} &gt; {{c.subCategory.toLowerCase()}}</span>
        </div>
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

.component_placer {
    position: absolute;
    width: 250px;
    height: 25px;
    background: none;

    border-bottom: 2px solid #ccc;
}

.component_placer > input {
    width: 100%;
    height: 25px;
    padding-left: var(--md);
    background: none;

    margin-bottom: var(--md);

    color: #ccc;
    font-family: 'Major Mono Display', monospace;
    line-height: 25px;
    vertical-align: middle;
    text-transform: lowercase;

    box-sizing: border-box;

    border: none;
}

.component_placer > input:focus {
    border: none;
    outline: none;
}

.component_placer__suggestions {
    width: 100%;
    padding-left: var(--md);
    padding-bottom: calc(var(--md) / 2);
    background: none;
    box-sizing: border-box;
}

.component_placer__suggestions:hover {
    cursor: pointer;
    background: grey;
    opacity: 0.8;
}

.component_placer__suggestions__name {
    width: 100%;
    height: 25px;
    color: #ccc;
    font-size: calc(1.75 * var(--md));

    line-height: 25px;
    vertical-align: middle;
}

.component_placer__suggestions__info {
    width: 100%;
    height: 15px;
    color: #ccc;
    font-size: var(--md);

    line-height: 15px;
    vertical-align: middle;
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
}

.svgar {
    position: absolute;
    left: calc(var(--lg) + var(--md) + var(--md));
    width: calc(100vw - var(--lg) - var(--md) - var(--md));
    height: 100vh;
    touch-action: none;
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

import WorkspaceOverlay from './../components/WorkspaceOverlay.vue';
import { GrasshopperComponent } from 'resthopper/dist/catalog/ComponentIndex';
import { levDist } from './../utils/levDist';
import { newGuid } from './../utils/newGuid';
import { GrasshopperParameter } from 'resthopper/dist/catalog/ParameterIndex';

interface ClasshopperMapping {
    [svgarId: string]: {
        component: ResthopperComponent | undefined,
        parameter: ResthopperParameter | undefined,
    }
}

type CanvasState = "idle" | "panning" | "movingComponent" | "drawingWire";

export default Vue.extend({
    name: 'workspace',
    components: {
        WorkspaceOverlay,
    },
    data() {
        return {
            w: 0,
            h: 0,
            state: "idle" as CanvasState,
            start: 0,
            click: 0,
            prev: 0,
            px: 0,
            py: 0,
            px2: 0,
            py2: 0,
            dx: 0,
            dy: 0,
            placing: false,
            candidate: "",
            allowed: [] as (ResthopperComponent | ResthopperParameter)[],
            placerX: 0,
            placerY: 0,
            cx: 0,
            cy: 0,
            wireSource: {} as ResthopperParameter | undefined,
            movingComponent: {} as ResthopperComponent,
            svgar: {} as SvgarCube,
            definition: {} as ResthopperDefinition,
            map: {} as ClasshopperMapping,
        }
    },
    created() {
        const ci = Resthopper.ComponentIndex;
        const pi = Resthopper.ParameterIndex;

        this.allowed = [...ci.getAllComponents(), ...pi.getAllParameters()];

        let def = new Resthopper.Definition();

        const n = pi.createParameter("Number", 2);
        n.position = { x: -5, y: 1 }
        n.isUserInput = true;

        let pt = ci.createComponent("ConstructPoint");
        pt.position = { x: 15, y: 0 };

        let m = ci.createComponent("Multiplication");
        m.position = { x: 0, y: -3.5 };
        let result = m.getOutputByIndex(0);

        def.parameters = [n];
        def.components = [pt, m];

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

            if (this.w == 0 || this.h == 0) {
                return "";
            }

            this.svgar = this.convertDefinitionToSvgar(this.definition);

            if (this.state == 'drawingWire') {
                let w = this.svgar.slabs.find(x => x.getName() == "newwire");
                let newW = this.drawNewWire();
                
                if (w) {
                    w = newW;
                }
                else {
                    this.svgar.slabs.push(newW);
                }
            }

            return this.svgar.compile(this.w, this.h);
        },
        activeComponent(): ResthopperComponent | undefined {
            return this.$store.state.component;
        },
        closeMatches(): ( ResthopperComponent | ResthopperParameter )[] {
            const c = this.candidate;
            return this.allowed.sort((a, b) => levDist(c, a.name) - levDist(c, b.name)).slice(0, 5);
        },
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
        isResthopperParameter(object: ResthopperComponent | ResthopperParameter): boolean {
            return object instanceof ResthopperParameter;
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
        onRequestOutput(): void {
            console.log("Result!");
        },
        onDoubleClick(event: MouseEvent | TouchEvent) {
            const xy = this.touchOrMouseCoordinates(event);
            const pt = this.svgar.mapPageCoordinateToSvgarCoordinate(xy[0], xy[1]);

            this.placerX = xy[0];
            this.placerY = xy[1];
            this.cx = pt[0];
            this.cy = pt[1];

            this.placing = true;

            this.$nextTick(() => { setTimeout(() => (<HTMLInputElement>this.$refs.newc).focus(), 50) })
        },
        onStartTrack(event: MouseEvent | TouchEvent): void {
            const d = Date.now();

            if (d - this.start < 500) {
                this.onDoubleClick(event);
                return;
            }

            this.placing = false;

            this.start = Date.now();

            let p = this.touchOrMouseCoordinates(event);

            this.px = p[0];
            this.py = p[1];
            this.px2 = p[0];
            this.py2 = p[1];

            if (this.state == 'idle') {
                this.state = "panning";
            }
        },
        onTrack(event: MouseEvent | TouchEvent | PointerEvent): void {
            if (Date.now() - this.prev < 50) {
                return;
            }

            if (event instanceof PointerEvent && !event.isPrimary) {
                return;
            }

            let p = this.touchOrMouseCoordinates(event);

            if (event instanceof TouchEvent) {
                event.stopImmediatePropagation();
            }

            // Get current and previous positions
            const a = this.svgar.mapPageCoordinateToSvgarCoordinate(this.px2, this.py2);
            const b = this.svgar.mapPageCoordinateToSvgarCoordinate(p[0], p[1]);

            if (this.state == 'panning') {
                Update().svgar.cube(this.svgar).camera.withPan(-(b[0] - a[0]), -(b[1] - a[1]));
            }
            if (this.state == 'movingComponent') {
                const dx = b[0] - a[0];
                const dy = b[1] - a[1];

                this.movingComponent.position = {
                    x: this.movingComponent.position.x += dx,
                    y: this.movingComponent.position.y += dy,
                }
            }

            // Cache previous position
            this.px2 = p[0];
            this.py2 = p[1];

            this.prev = Date.now();
        },
        onStopTrack(event: MouseEvent | TouchEvent): void {
            this.px = 0;
            this.py = 0;
            this.wireSource = undefined;
            this.candidate = "";

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

            d.parameters.forEach(p => {
                //dwg.slabs.push(this.drawParameter(p));
            })

            dwg.slabs.push(this.drawWires(d));

            if (this.svgar.scope) {
                dwg.scope = this.svgar.scope;
            }
            else {
                Update().svgar.cube(dwg).camera.extentsTo(-30, -20, 30, 10);
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

            wires.setElevation(-40);

            return wires;
        },
        drawNewWire(): SvgarSlab {
            let w = new Svgar.Slab("newwire");
            let el = <Element>this.$refs.svgar;
            let a = this.wireSource!.position;
            let b = this.svgar.mapPageCoordinateToSvgarCoordinate(this.px2, this.py2, el);

            const o = 1.5;

            w.addPath(new Svgar.Builder.Curve(a.x, a.y)
            .via(a.x + o, a.y)
            .through((a.x + b[0]) / 2, (a.y + b[1]) / 2)
            .via(b[0] - o, b[1])
            .through(b[0], b[1])
            .build());
            w.setElevation(50);

            w.setAllStyles([
                {
                    name: "default",
                    attributes: {
                        "stroke": "#F4F4F4",
                        "stroke-width": "2px",
                        "fill": "none",
                        "pointer-events": "none",
                    }
                }
            ]);

            return w;
        },
        drawComponent(c: ResthopperComponent): SvgarSlab {
            const g = newGuid().split("-")[0];
            let cslab = new SvgarSlab(`${c.name}${g}`);
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

            let text: {
                text: string,
                tag: string,
                elevation: number,
                position: {
                    x: number,
                    y: number
                }
            }[] = [];

            text.push({
                text: c.nickName.toLowerCase(),
                tag: "title",
                elevation: 5,
                position: {
                    x: x,
                    y: y,
                },
            })

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

                text.push({
                    text: c.input[inputs[i]].nickName.toLowerCase(),
                    tag: "inputparam",
                    elevation: 50,
                    position: {
                        x: -5 + x + 1,
                        y: -(2.5 + y - st - (step / 2)),
                    },
                });

                let panel = new Svgar.Builder.Polyline(-5 + x, 2.5 + y - st)
                .lineTo(x, 2.5 + y - st)
                .lineTo(x, 2.5 + y - st - step)
                .lineTo(-5 + x, 2.5 + y - st - step)
                .close()
                .build();

                panel.setTag("panel");
                panel.setElevation(-10);
                panel.attach("mousedown", this.onClickInput);

                cslab.addPath(panel);

                let status = new Svgar.Builder.Polyline(-5 + x, 2.5 + y - st)
                .lineTo(-5 + gs + x, 2.5 + y - st)
                .lineTo(-5 + gs + x, 2.5 + y - st - step)
                .lineTo(-5 + x, 2.5 + y - st - step)
                .build();
                status.setTag(c.input[inputs[i]].isOptional ? "grip-empty" : c.input[inputs[i]].sources.length > 0 ? "grip-empty" : "grip-warn");
                status.setElevation(-5);
                cslab.addPath(status);

                let grip = new Svgar.Builder.Circle(-5 + x, 2.5 + y - st - (step / 2), 0.3).build();
                grip.setTag("grip-empty");
                grip.setElevation(10);

                grip.attach("mouseup", this.onSubmitWire)

                this.map[panel.getId()] = { component: c, parameter: c.input[inputs[i]] };
                this.map[grip.getId()] = { component: c, parameter: c.input[inputs[i]] };

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

                text.push({
                    text: c.output[outputs[i]].nickName.toLowerCase(),
                    tag: "outputparam",
                    elevation: 50,
                    position: {
                        x: 5 + x - 1,
                        y: -(2.5 + y - st - (ostep / 2)),
                    },
                });

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
                grip.attach("mousedown", this.onClickOutputGrip)

                this.map[grip.getId()] = { component: c, parameter: c.output[outputs[i]] };

                cslab.addPath(grip);
            }
            
            cslab.setAllText(text);

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
                    name: "paramfontleft",
                    attributes: {
                        "font": "0.6px 'Major Mono Display'",
                        "font-weight": "bold",
                        "fill": "#222222",
                        "pointer-events": "none",
                        "user-select": "none",
                        "text-anchor": "start",
                        "transform-origin": `${x}px ${y}px`,
                        "transform": "translateY(0.2px)",
                    }
                },
                {
                    name: "paramfontright",
                    attributes: {
                        "font": "0.6px 'Major Mono Display'",
                        "font-weight": "bold",
                        "fill": "#222222",
                        "pointer-events": "none",
                        "user-select": "none",
                        "text-anchor": "end",
                        "transform-origin": `${x}px ${y}px`,
                        "transform": "translateY(0.2px)",
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
                        "inputparam": "paramfontleft",
                        "outputparam": "paramfontright",
                        "shadow": "shadow",
                        "grip-invalid": "red",
                        "grip-warn": "orange",
                        "grip-empty": "empty"
                    }
                }
            ]);

            return cslab;
        },
        drawParameter(p: ResthopperParameter): SvgarSlab {
            let pSlab = new Svgar.Slab(`${p.name}${p.instanceGuid.split("-")[0]}`);
            pSlab.scaleStroke = true;

            const x = p.position.x;
            const y = p.position.y;
            const s = 1.25;

            let outline = new Svgar.Builder.Polyline(x + s, y + s)
                .lineTo(x - s, y + s)
                .lineTo(x - s, y - s)
                .lineTo(x + s, y - s)
                .close()
                .build();

            pSlab.addPath(outline);

            pSlab.setAllStyles([
                {
                    name: "default",
                    attributes: {
                        "stroke": "black",
                        "stroke-width": "0.1px",
                        "fill": "none",
                    }
                }
            ])

            return pSlab;
        },
        onClickComponent(event: MouseEvent): void {
            this.state = 'movingComponent';
            this.movingComponent = this.map[(<Element>event.srcElement!).id].component!;
            this.$store.commit('setActiveComponent', this.movingComponent);

            //console.log(this.map[(<Element>event.srcElement!).id].component!.name);
        },
        onClickOutputGrip(event: MouseEvent): void {
            this.state = 'drawingWire';
            this.wireSource = this.map[(<Element>event.srcElement!).id].parameter!;
            this.$store.commit('setActiveComponent', this.map[(<Element>event.srcElement!).id].component!);
        },
        onClickInput(event: MouseEvent): void {
            let input = this.map[(<Element>event.srcElement!).id].parameter!;
            this.$store.commit('setActiveParameter', input);
            this.$store.commit('setActiveComponent', this.map[(<Element>event.srcElement!).id].component!);
        },
        onSubmitWire(event: MouseEvent): void {
            let input = this.map[(<Element>event.srcElement!).id].parameter!;
            input.setSource(this.wireSource!.instanceGuid);
            this.$store.commit('setActiveComponent', this.map[(<Element>event.srcElement!).id].component!);
        },
        onSubmitComponent(): void {
            this.placing = false;
            this.onSelectComponentOrParam(this.closeMatches[0]);
        },
        onSelectComponentOrParam(c: ResthopperComponent | ResthopperParameter): void {
            this.placing = false;

            const name = c.name.replace(" ", "");
            const position = { x: this.cx, y: this.cy }

            if (c instanceof ResthopperComponent) {
                try {
                    let component = Resthopper.ComponentIndex.createComponent(name as GrasshopperComponent);
                    component.position = position;
                    this.definition.components.push(component);
                }
                catch {
                    console.log(`Unable to create ${c.name} component.`);
                }
            }
            else {
                try {
                    let param = Resthopper.ParameterIndex.createParameter(name as GrasshopperParameter);
                    param.position = position;
                    this.definition.parameters.push(param);
                }
                catch {
                    console.log(`Unable to create ${c.name} parameter.`);
                }
            }

            this.candidate = "";
        },
        separateCamelCase(string: string): string {
            if (string == undefined) {
                return "";
            }
            return string.match(/[A-Z][a-z]+/g)!.join(" ").toLowerCase();
        }

    }
})
</script>