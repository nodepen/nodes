import GraphObject from './../GlasshopperGraphObject';
import ResthopperComponent from 'resthopper/dist/models/ResthopperComponent';
import SvgarStyle from 'svgar/dist/models/SvgarStyle';
import SvgarState from 'svgar/dist/models/SvgarState';
import Svgar, { Create } from 'svgar';
import SvgarPath from 'svgar/dist/models/SvgarPath';
import SvgarText from 'svgar/dist/models/SvgarText';
import store from './../../store/index';
import GraphMapping from './../GlasshopperGraphMapping';

export default class GenericComponent extends GraphObject {

    private readonly size: number = 5;
    private x: number;
    private y: number;
    
    constructor(component: ResthopperComponent) {
        super(component);
        this.x = component.position.x;
        this.y = component.position.y;
        this.draw('default');
    }

    public attachToComponent(event: string, callback: () => any): void {
        const paths: SvgarPath[] = this.svgar.getAllGeometry().filter(p => p.getTag() == 'icon' || p.getTag() == 'background');
        paths.forEach(p => p.attach(event, callback));
    }

    public redraw(state?: string): void {
        this.draw(state);
        this.svgar.compile();
    }

    // Generate and compile svgar slab information for component
    public draw(state?: string): void {
        const svg = this.svgar;

        this.x = this.component.position.x;
        this.y = this.component.position.y;

        const x = this.x;
        const y = this.y;
        const s = this.size;
        const sh = 0.21;
        const wStep = s;
        const hStep = s / 2;

        const geometry: SvgarPath[] = [
            Create().svgar.path
            .withTag('background')
            .withElevation(-8)
            .from.polyline(new Svgar.Builder.Polyline(x + wStep, y + hStep)
                .lineTo(x - wStep, y + hStep)
                .lineTo(x - wStep, y - hStep)
                .lineTo(x + wStep, y - hStep)
                .close()),
            Create().svgar.path
            .withTag('spacer')
            .withElevation(0)
            .from.polyline(new Svgar.Builder.Polyline(x + wStep, y + hStep)
                .lineTo(x - wStep, y + hStep)
                .lineTo(x - wStep, y - hStep)
                .lineTo(x + wStep, y - hStep)
                .close()),
            // Create().svgar.path
            // .withTag('shadow')
            // .withElevation(-5)
            // .from.polyline(new Svgar.Builder.Polyline(x + wStep, y + hStep)
            //     .lineTo(x + wStep, y - hStep)
            //     .lineTo(x - wStep, y - hStep)
            //     .lineTo(x - wStep + sh, y - hStep - sh)
            //     .lineTo(x + wStep + sh, y - hStep - sh)
            //     .lineTo(x + wStep + sh, y + hStep - sh)
            //     .close()),
            Create().svgar.path
            .withTag('outline')
            .withElevation(3)
            .from.polyline(new Svgar.Builder.Polyline(x + wStep, y + hStep)
                .lineTo(x - wStep, y + hStep)
                .lineTo(x - wStep, y - hStep)
                .lineTo(x + wStep, y - hStep)
                .close()),
            Create().svgar.path
            .withTag('outline')
            .withElevation(7)
            .from.polyline(new Svgar.Builder.Polyline(x + (hStep / 2), y + hStep)
                .lineTo(x - (hStep / 2), y + hStep)
                .lineTo(x - (hStep / 2), y - hStep)
                .lineTo(x + (hStep / 2), y - hStep)
                .close()),
            Create().svgar.path
            .withTag('icon')
            .withElevation(10)
            .from.polyline(new Svgar.Builder.Polyline(x + (s / 8), y + (s / 8))
                .lineTo(x - (s / 8), y + (s / 8))
                .lineTo(x - (s / 8), y - (s / 8))
                .lineTo(x + (s / 8), y - (s / 8))
                .close()),
            Create().svgar.path
            .withTag('spacer')
            .withElevation(5)
            .from.polyline(new Svgar.Builder.Polyline(x + (hStep / 2), y + hStep)
                .lineTo(x + (hStep / 2), y - hStep)),
            Create().svgar.path
            .withTag('spacer')
            .withElevation(5)
            .from.polyline(new Svgar.Builder.Polyline(x - (hStep / 2), y + hStep)
                .lineTo(x - (hStep / 2), y - hStep)),
            Create().svgar.path
            .withTag('spacer')
            .withElevation(2)
            .from.polyline(new Svgar.Builder.Polyline(x - wStep, y + hStep)
                .lineTo(x - wStep, y - hStep)),
            Create().svgar.path
            .withTag('spacer')
            .withElevation(2)
            .from.polyline(new Svgar.Builder.Polyline(x + wStep, y + hStep)
                .lineTo(x + wStep, y - hStep)),
            Create().svgar.path
            .withTag('selection')
            .withElevation(-10)
            .from.circle(new Svgar.Builder.Circle(x, y, s * 1.5)) 
        ]

        geometry.filter(path => path.getTag() === 'background' || path.getTag() === 'icon')
        .forEach(path => {
            const map: GraphMapping = {};
            store.state.map[path.getId()] = {
                object: this,
                component: this.component,
                parameter: undefined,
            }
        })

        const parameters = this.drawParameters();

        this.svgar.setCurrentState(state ?? 'default');
        this.svgar.setAllGeometry([...geometry, ...parameters]);
        this.svgar.setAllStyles(this.getSvgarStyles());
        this.svgar.setAllStates(this.getSvgarStates());
        
        this.svgar.flag('geometry');
        this.svgar.flag('state');
        this.svgar.flag('style');

        this.svgar.compile();
    }

    private drawParameters(): SvgarPath[] {
        let dividers: SvgarPath[] = [];
        let grips: SvgarPath[] = [];
        let labels: SvgarText[] = [];

        const c = this.component;
        const x = this.x;
        const y = this.y;
        const s = this.size;
        const inputs = this.component.getAllInputs().reverse();
        const inputCount = this.component.getInputCount();
        const inputStep = s / inputCount;
        const outputs = this.component.getAllOutputs().reverse();
        const outputCount = this.component.getOutputCount();
        const outputStep = s / outputCount;

        for (let i = 0; i < inputCount; i++) {
            const p = inputs[i];
            const yDelta = inputStep * (i + 1); 
            let xPosition = x - s;
            let yPosition = y + (s / 2) - yDelta;

            if (i != inputCount - 1) {
                dividers.push(
                    Create().svgar.path
                    .withTag('divider')
                    .withElevation(1)
                    .from.polyline(new Svgar.Builder.Polyline(xPosition, yPosition)
                        .lineTo(x - (s / 4), yPosition))
                )
            }

            grips.push(
                Create().svgar.path
                .withTag('grip')
                .withElevation(10)
                .from.circle(new Svgar.Builder.Circle(xPosition, yPosition + (inputStep / 2), 0.25))
            )

            labels.push(
                {
                    text: p.nickName,
                    position: {
                        x: xPosition + (s / 10),
                        y: -1 * (yPosition + (inputStep / 2) - 0.25),
                    },
                    elevation: 10,
                    tag: 'inputlabel'
                }
            )
        }

        for (let i = 0; i < outputCount; i++) {
            const p = outputs[i];
            const yDelta = outputStep * (i + 1);
            let xPosition = x + s;
            let yPosition = y + (s / 2) - yDelta;

            if (i != outputCount - 1) {
                dividers.push(
                    Create().svgar.path
                    .withTag('divider')
                    .withElevation(1)
                    .from.polyline(new Svgar.Builder.Polyline(xPosition, yPosition)
                        .lineTo(x + (s / 4), yPosition))
                )
            }

            grips.push(
                Create().svgar.path
                .withTag('grip')
                .withElevation(10)
                .from.circle(new Svgar.Builder.Circle(xPosition, yPosition + (outputStep / 2), 0.25))
            )

            labels.push(
                {
                    text: p.nickName,
                    position: {
                        x: xPosition - (s / 10),
                        y: -1 * (yPosition + (outputStep / 2) - 0.25),
                    },
                    elevation: 10,
                    tag: 'outputlabel'
                }
            )
        }

        this.svgar.setAllText(labels);

        return [...dividers, ...grips];
    }

    private getSvgarStyles(): SvgarStyle[] {
        const heavy = '2.1mm';
        const medium = '0.7mm';

        return [
            {
                name: 'default',
                attributes: {
                    'stroke': 'black',
                    'fill': 'none',
                }
            },
            {
                name: 'whitefill',
                attributes: {
                    'stroke': 'none',
                    'stroke-width': '0px',
                    'fill': 'white',
                }
            },
            {
                name: 'greyfill',
                attributes: {
                    'stroke': 'none',
                    'stroke-width': '0px',
                    'fill': 'grey'
                }
            },
            {
                name: 'greymedium',
                attributes: {
                    'stroke': 'gainsboro',
                    'stroke-width': medium,
                    'fill': 'gainsboro',
                    'pointer-events': 'none'
                }
            },
            {
                name: 'whitefill:hover',
                attributes: {
                    'stroke': 'none',
                    'stroke-width': '0px',
                    'fill': 'grey'
                }
            },
            {
                name: 'blackmedium',
                attributes: {
                    'stroke': 'black',
                    'stroke-width': medium,
                    'fill': 'none',
                    'pointer-events': 'none'
                }
            },
            {
                name: 'blackmediumdashed',
                attributes: {
                    'stroke': 'black',
                    'stroke-width': medium,
                    'stroke-dasharray': heavy,
                    'fill': 'white',
                }
            },
            {
                name: 'blackmediumwhitefill',
                attributes: {
                    'stroke': 'black',
                    'stroke-width': medium,
                    'fill': 'white'
                }
            },
            {
                name: 'whiteheavy',
                attributes: {
                    'stroke': 'white',
                    'stroke-width': heavy,
                    'fill': 'none',
                    'stroke-linecap': 'square',
                    'pointer-events': 'none'
                }
            },
            {
                name: "labelfontleftalign",
                attributes: {
                    "font": "0.75px 'Nova Mono'",
                    "font-weight": "bold",
                    "fill": "black",
                    "pointer-events": "none",
                    "user-select": "none",
                    "text-anchor": "start",
                }
            },
            {
                name: "labelfontrightalign",
                attributes: {
                    "font": "0.75px 'Nova Mono'",
                    "font-weight": "bold",
                    "fill": "black",
                    "pointer-events": "none",
                    "user-select": "none",
                    "text-anchor": "end",
                }
            },
            {
                name: 'hidden',
                attributes: {
                    'display': 'none',
                }
            }
        ]
    }

    private getSvgarStates(): SvgarState[] {
        return [
            { 
                name: 'default', 
                styles: { 
                    'background': 'whitefill',
                    'shadow': 'greymedium',
                    'outline': 'blackmedium',
                    'divider': 'blackmedium',
                    'icon': 'blackmediumwhitefill',
                    'grip': 'blackmediumwhitefill',
                    'spacer': 'whiteheavy',
                    'selection': 'hidden',
                    'inputlabel': 'labelfontleftalign',
                    'outputlabel': 'labelfontrightalign',
                } 
            },
            { 
                name: 'visible', 
                styles: { 
                    'background': 'whitefill',
                    'shadow': 'greymedium',
                    'outline': 'blackmedium',
                    'divider': 'blackmedium',
                    'icon': 'blackmediumwhitefill',
                    'grip': 'blackmediumwhitefill',
                    'spacer': 'whiteheavy',
                    'selection': 'hidden',
                    'inputlabel': 'labelfontleftalign',
                    'outputlabel': 'labelfontrightalign',
                } 
            },
            {
                name: 'hidden',
                styles: {
                    'background': 'greyfill',
                    'shadow': 'greymedium',
                    'outline': 'blackmedium',
                    'divider': 'blackmedium',
                    'icon': 'blackmediumwhitefill',
                    'grip': 'blackmediumwhitefill',
                    'spacer': 'whiteheavy',
                    'selection': 'hidden',
                    'inputlabel': 'labelfontleftalign',
                    'outputlabel': 'labelfontrightalign',
                }
            },
            {
                name: 'selected',
                styles: {
                    'background': 'whitefill',
                    'shadow': 'greymedium',
                    'outline': 'blackmedium',
                    'divider': 'blackmedium',
                    'icon': 'blackmediumwhitefill',
                    'grip': 'blackmediumwhitefill',
                    'spacer': 'whiteheavy',
                    'selection': 'blackmediumdashed',
                    'inputlabel': 'labelfontleftalign',
                    'outputlabel': 'labelfontrightalign',                   
                }
            },
            {
                name: 'selectedhidden',
                styles: {
                    'background': 'greyfill',
                    'shadow': 'greymedium',
                    'outline': 'blackmedium',
                    'divider': 'blackmedium',
                    'icon': 'blackmediumwhitefill',
                    'grip': 'blackmediumwhitefill',
                    'spacer': 'whiteheavy',
                    'selection': 'blackmediumdashed',
                    'inputlabel': 'labelfontleftalign',
                    'outputlabel': 'labelfontrightalign', 
                }
            }
        ];
    }
}