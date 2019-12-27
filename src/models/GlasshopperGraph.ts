import ResthopperDefinition from 'resthopper/dist/models/ResthopperDefinition';
import SvgarCube from 'svgar/dist/models/SvgarCube';
import ResthopperComponent from 'resthopper/dist/models/ResthopperComponent';
import GraphObject from './GlasshopperGraphObject';
import ResthopperParameter from 'resthopper/dist/models/ResthopperParameter';
import Svgar,{ SvgarSlab, SvgarPath, Locate } from 'svgar';

export default class GlasshopperGraph {

    public graphObjects: GraphObject[];
    public svgar: SvgarCube;
    public wires: SvgarSlab;
    public currentWire: SvgarSlab;
    public currentWireStart: {
        x: number,
        y: number
    } = { x: 0, y: 0 }
    public svg = "";
    
    private w = 100;
    private h = 100;

    constructor() {
        this.svgar = new SvgarCube("glasshopper");

        const wireStyle = {
            name: 'default',
            attributes: {
                'pointer-events': 'none',
                'touch-action': 'none',
                'stroke': 'black',
                'fill': 'none',
                'stroke-width': '0.7mm'
            }
        }

        this.wires = new SvgarSlab("wires");
        this.wires.setElevation(-50);
        this.svgar.slabs.push(this.wires);
        this.wires.setAllStyles([ wireStyle ]);

        this.currentWire = new SvgarSlab("currentwire");
        this.currentWire.setElevation(50);
        this.svgar.slabs.push(this.currentWire);
        this.currentWire.setAllStyles([ wireStyle ])

        this.graphObjects = [];
    }

    public addObject(object: GraphObject): void {
        this.graphObjects.push(object);
        this.svgar.slabs.push(object.svgar);
        this.redraw(this.w, this.h);
    }

    // Instantiate a new svgar path for the newly started wire
    public startWire(svgarX: number, svgarY: number): void {
        this.currentWireStart = { x: svgarX, y: svgarY };
        this.currentWire.setAllGeometry([
            new Svgar.Builder.Curve(svgarX, svgarY)
            .via(svgarX, svgarY)
            .through(svgarX, svgarY)
            .build()
        ]);

        this.currentWire.compile();
    }

    // Update the ending position for the newly started wire
    public updateWire(svgarX: number, svgarY: number): void {
        const xi = this.currentWireStart.x;
        const yi = this.currentWireStart.y;

        this.currentWire.setAllGeometry([
            this.drawWire({x: xi, y: yi}, {x: svgarX, y: svgarY})
        ]);

        this.currentWire.compile();
    }

    private drawWire(from: {x: number, y: number}, to: {x: number, y: number}): SvgarPath {
        const o = 1.25;
        const offset = to.x > from.x ? o : o * -1;

        return new Svgar.Builder.Curve(from.x, from.y)
            .via(from.x + offset, from.y)
            .through((from.x + to.x) / 2, (from.y + to.y) / 2)
            .via(to.x + (-offset), to.y)
            .through(to.x, to.y)
            .build()
    }

    // Terminate the newly started wire
    public cancelWire(): void {
        this.currentWire.setAllGeometry([]);
        this.redrawWires();
    }

    // Commit the wire to the wires slab
    public commitWire(): void {
        this.wires.addPath(this.currentWire.getAllGeometry()[0]);
        this.cancelWire();
    }

    // Set an output parameter as the source of an input parameter and draw their wire.
    public connect(a: string, b: string): void {
        // Verify that both parameters exist
        const paramA = this.locateParameter(a);
        const paramB = this.locateParameter(b);

        if (paramA === undefined || paramB === undefined) {
            return;
        }

        // Locate parent component for each
        const componentA = this.locateComponentByParameter(paramA.instanceGuid);
        const componentB = this.locateComponentByParameter(paramB.instanceGuid);

        if (componentA === undefined || componentB === undefined) {
            return;
        }

        // Verify connection is being attempted between an input and output
        const isInputA = this.isInputParameter(componentA, paramA.instanceGuid);
        const isInputB = this.isInputParameter(componentB, paramB.instanceGuid);

        if (isInputA === isInputB) {
            return;
        }

        // Set input param as source for output param
        const inputParam = isInputA ? paramA : paramB;
        const outputParam = isInputA ? paramB : paramA;

        inputParam.setSource(outputParam.instanceGuid);

        // Reset current wire
        this.cancelWire();
    }

    public isInputParameter(component: ResthopperComponent, id: string): boolean {
        for (const input of component.getAllInputs()) {
            if (input.instanceGuid === id) {
                return true;
            }
        }

        return false;
    }

    public redrawWires(): void {
        const wires: SvgarPath[] = [];

        this.graphObjects.forEach(o => {
            const inputs = o.component.getAllInputs();

            inputs.forEach(i => {
                i.sources.forEach(source => {
                    const sourceObject = this.locateObjectByParameter(source);

                    const [xa, ya] = o.getParameterPosition(i.instanceGuid)!;
                    const [xb, yb] = sourceObject?.getParameterPosition(source)!;

                    wires.push(this.drawWire({x: xa, y: ya}, {x: xb, y: yb}));
                })
            })
        });

        this.wires.setAllGeometry(wires);
    }

    public locateObject(guid: string): GraphObject | undefined {
        return this.graphObjects.find(x => x.guid === guid);
    }

    public locateObjectByParameter(guid: string): GraphObject | undefined {
        let search: GraphObject | undefined = undefined;

        this.graphObjects.forEach(obj => {
            const parameters = [...obj.component.getAllInputs(), ...obj.component.getAllOutputs()];
            const filtered = parameters.filter(x => x.instanceGuid === guid);
            if (filtered.length > 0) {
                search = obj;
            }
        })

        return search;
    }

    public locateComponent(guid: string): ResthopperComponent | undefined {
        return this.graphObjects.find(x => x.guid == guid)?.component;
    }

    public locateComponentByParameter(guid: string): ResthopperComponent | undefined {
        const components = this.graphObjects.map(x => x.component);

        for (const c of components) {
            for (const input of c.getAllInputs()) {
                if (input.instanceGuid === guid) {
                    return c;
                }
            }
            for (const output of c.getAllOutputs()) {
                if (output.instanceGuid === guid) {
                    return c;
                }
            }
        }

        return undefined;
    }

    public locateParameter(guid: string, hint?: 'input' | 'output'): ResthopperParameter | undefined {
        const components = this.graphObjects.map(x => x.component);

        let parameters: ResthopperParameter[] = [];

        for (const c of components) {
            const p = hint ? hint == 'input' ? c.getAllInputs() : c.getAllOutputs() : [...c.getAllInputs(), ...c.getAllOutputs()];
            const search = p.find(x => x.instanceGuid === guid);
            
            if (search != undefined) {
                return search;
            }
        }

        return undefined;
    }

    public setCamera(x: number, y: number, w: number, h: number): void {
        this.svgar.frame([x, y], w, h);
    }

    public redraw(w: number, h: number): void {
        this.svgar.flag('root');
        
        this.redrawWires();

        this.w = w;
        this.h = h;
    }

    public reset(): void {
        this.graphObjects.forEach(x => {
            x.draw(x.state);
        })
    }

    public compute(component: string, parameter?: string): void {
        const c = this.locateComponent(component);
        const targets = Object.values(c?.output ?? {}).map(t => t.guid).filter(t => parameter ? t === parameter : true);

        const rhdoc = new ResthopperDefinition();
        rhdoc.components = this.graphObjects.map(x => x.component);

        targets.forEach(t => {
            const ghdoc = rhdoc.toGrasshopperDocument([t]);
            // dispatch a solution
        })
    }

    public stage(): void {
        const rhdoc = new ResthopperDefinition();
        rhdoc.components = this.graphObjects.map(x => x.component);

        console.log(JSON.stringify(rhdoc.toGrasshopperDocument([])));
    }
}