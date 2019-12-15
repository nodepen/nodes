import ResthopperDefinition from 'resthopper/dist/models/ResthopperDefinition';
import SvgarCube from 'svgar/dist/models/SvgarCube';
import ResthopperComponent from 'resthopper/dist/models/ResthopperComponent';
import GraphObject from './GlasshopperGraphObject';
import ResthopperParameter from 'resthopper/dist/models/ResthopperParameter';

export default class GlasshopperGraph {

    private graphObjects: GraphObject[];
    private svgar: SvgarCube;
    public svg: string = "";

    constructor() {
        this.svgar = new SvgarCube("glasshopper");
        this.graphObjects = [];
    }

    public addObject(object: GraphObject): void {
        this.graphObjects.push(object);
        this.svgar.slabs.push(object.svgar);
    }

    public locateObject(guid: string): GraphObject | undefined {
        return this.graphObjects.find(x => x.guid === guid);
    }

    public locateComponent(guid: string): ResthopperComponent | undefined {
        return this.graphObjects.find(x => x.guid == guid)?.component;
    }

    public locateParameter(guid: string, hint?: 'input' | 'output'): ResthopperParameter | undefined {
        const components = this.graphObjects.map(x => x.component);

        var parameters: ResthopperParameter[] = [];

        for (const c of components) {
            const p = hint ? hint == 'input' ? c.getAllInputs() : c.getAllOutputs() : [...c.getAllInputs(), ...c.getAllOutputs()];
            parameters = parameters.concat(p);
        }

        return parameters.find(x => x.guid == guid);
    }

    public redraw(w: number, h: number): void {
        this.svg = this.svgar.compile(w, h);
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