import GraphObject from './../GlasshopperGraphObject';
import ResthopperComponent from 'resthopper/dist/models/ResthopperComponent';
import SvgarStyle from 'svgar/dist/models/SvgarStyle';
import SvgarState from 'svgar/dist/models/SvgarState';
import Svgar, { Create } from 'svgar';

export default class GenericComponent extends GraphObject {
    
    constructor(component: ResthopperComponent) {
        super(component);
        this.draw();
    }

    // Generate and compile svgar slab information for component
    public draw(): void {
        const svg = this.svgar;

        const x = this.component.position.x;
        const y = this.component.position.y;
        const w = 10;
        const wStep = w / 2;
        const h = 5;
        const hStep = h / 2;

        const outline = Create().svgar.path
        .withTag('outline')
        .from.polyline(new Svgar.Builder.Polyline(x + wStep, y + hStep)
            .lineTo(x - wStep, y + hStep)
            .lineTo(x - wStep, y - hStep)
            .lineTo(x + wStep, y - hStep)
            .close())

        this.svgar.addPath(outline);
        this.svgar.setAllStyles(this.getSvgarStyles());
        this.svgar.setAllStates(this.getSvgarStates());
    }

    private getSvgarStyles(): SvgarStyle[] {
        return [
            {
                name: 'default',
                attributes: {
                    'stroke': 'black',
                    'fill': 'none',
                }
            },
            {
                name: 'strokenofill',
                attributes: {
                    'stroke': 'black',
                    'stroke-width': '2px',
                    'fill': 'none'
                }
            }
        ]
    }

    private getSvgarStates(): SvgarState[] {
        return [
            { 
                name: 'default', 
                styles: { 
                    'outline': 'strokenofill' 
                } 
            }
        ];
    }
}