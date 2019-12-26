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

        this.wires = new SvgarSlab("wires");
        this.wires.setElevation(-50);
        this.svgar.slabs.push(this.wires);

        this.currentWire = new SvgarSlab("currentwire");
        this.currentWire.setElevation(-50);
        this.svgar.slabs.push(this.currentWire);
        this.currentWire.setAllStyles([
            {
                name: 'default',
                attributes: {
                    'pointer-events': 'none',
                    'touch-action': 'none',
                    'stroke': 'black',
                    'fill': 'none',
                    'stroke-width': '0.7mm'
                }
            }
        ])

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

        const o = 1.25;
        const offset = svgarX > xi ? o : o * -1;

        this.currentWire.setAllGeometry([
            new Svgar.Builder.Curve(xi, yi)
            .via(xi + offset, yi)
            .through((xi + svgarX) / 2, (yi + svgarY) / 2)
            .via(svgarX + (-offset), svgarY)
            .through(svgarX, svgarY)
            .build()
        ]);

        this.currentWire.compile();
    }

    // Terminate the newly started wire
    public cancelWire(): void {
        this.currentWire.setAllGeometry([]);
    }

    // Commit the wire to the wires slab
    public commitWire(): void {
        this.wires.addPath(this.currentWire.getAllGeometry()[0]);
        this.cancelWire();
    }

    public redrawWires(): void {
        const wires = new SvgarCube('wires');

        this.graphObjects.forEach(o => {
            const inputs = o.component.getAllInputs();

            inputs.forEach(i => {
                i.sources.forEach(source => {

                })
            })
        })
    }

    public locateObject(guid: string): GraphObject | undefined {
        return this.graphObjects.find(x => x.guid === guid);
    }

    public locateComponent(guid: string): ResthopperComponent | undefined {
        return this.graphObjects.find(x => x.guid == guid)?.component;
    }

    public locateParameter(guid: string, hint?: 'input' | 'output'): ResthopperParameter | undefined {
        const components = this.graphObjects.map(x => x.component);

        let parameters: ResthopperParameter[] = [];

        for (const c of components) {
            const p = hint ? hint == 'input' ? c.getAllInputs() : c.getAllOutputs() : [...c.getAllInputs(), ...c.getAllOutputs()];
            const search = p.find(x => x.guid === guid);
            
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
        //this.svg = this.svgar.compile(w, h);

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
}