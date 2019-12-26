import ResthopperDefinition from 'resthopper/dist/models/ResthopperDefinition';
import SvgarCube from 'svgar/dist/models/SvgarCube';
import ResthopperComponent from 'resthopper/dist/models/ResthopperComponent';
import GraphObject from './GlasshopperGraphObject';
import ResthopperParameter from 'resthopper/dist/models/ResthopperParameter';
import { SvgarSlab, SvgarPath, Locate } from 'svgar';

export default class GlasshopperGraph {

    public graphObjects: GraphObject[];
    public svgar: SvgarCube;
    public wires: SvgarSlab;
    public currentWire: SvgarPath | undefined;
    public svg = "";
    
    private w = 100;
    private h = 100;

    constructor() {
        this.svgar = new SvgarCube("glasshopper");
        this.wires = new SvgarSlab('wires');
        this.wires.setElevation(-50);
        this.svgar.slabs.push(this.wires);
        this.graphObjects = [];
    }

    public addObject(object: GraphObject): void {
        this.graphObjects.push(object);
        this.svgar.slabs.push(object.svgar);
        this.redraw(this.w, this.h);
    }

    // Instantiate a new svgar path for the newly started wire
    public startWire(svgarX: number, svgarY: number): void {

    }

    // Update the ending position for the newly started wire
    public updateWire(svgarX: number, svgarY: number): void {

    }

    // Terminate the newly started wire
    public cancelWire(): void {
        this.currentWire = undefined;
    }

    // Commit the wire to the wires slab
    public commitWire(): void {

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