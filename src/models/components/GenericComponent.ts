import GraphObject from './../GlasshopperGraphObject';
import ResthopperComponent from 'resthopper/dist/models/ResthopperComponent';
import SvgarStyle from 'svgar/dist/models/SvgarStyle';
import SvgarState from 'svgar/dist/models/SvgarState';

export default class GenericComponent extends GraphObject {
    
    constructor(component: ResthopperComponent) {
        super(component);
        this.draw();
    }

    // Generate and compile svgar slab information for component
    public draw(): void {
        const svg = this.svgar;
    }

    private getSvgarStyles(): SvgarStyle[] {
        return [
            {
                name: 'default',
                attributes: {
                    'stroke': 'black',
                }
            }
        ]
    }

    private getSvgarStates(): SvgarState {
        return { name: 'default', styles: { 'tag': 'style' } };
    }
}