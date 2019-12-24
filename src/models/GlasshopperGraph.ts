import ResthopperDefinition from 'resthopper/dist/models/ResthopperDefinition';
import SvgarCube from 'svgar/dist/models/SvgarCube';
import ResthopperComponent from 'resthopper/dist/models/ResthopperComponent';
import GraphObject from './GlasshopperGraphObject';
import ResthopperParameter from 'resthopper/dist/models/ResthopperParameter';

export default class GlasshopperGraph {

    public graphObjects: GraphObject[];
    public svgar: SvgarCube;
    public svg = "";
    
    private w = 100;
    private h = 100;

    constructor() {
        this.svgar = new SvgarCube("glasshopper");
        this.graphObjects = [];
    }

    public addObject(object: GraphObject): void {
        this.graphObjects.push(object);
        this.svgar.slabs.push(object.svgar);
        this.redraw(this.w, this.h);
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
            parameters = parameters.concat(p);
        }

        return parameters.find(x => x.guid == guid);
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