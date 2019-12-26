import ResthopperComponent from 'resthopper/dist/models/ResthopperComponent';
import { SvgarSlab } from 'svgar';
import { newGuid } from './../utils/newGuid';

type GraphObjectState = 'selected' | 'visible' | 'hidden';

export default class GlasshopperGraphObject {

    public readonly component: ResthopperComponent;
    public readonly svgar: SvgarSlab;
    public readonly guid: string;
    public readonly cache: { [param: string]: any | undefined } = {};
    public state: GraphObjectState = 'visible';

    constructor(component: ResthopperComponent) {
        this.component = component;
        this.component.getAllOutputs().forEach(p => this.cache[p.name] = undefined);
        this.svgar = new SvgarSlab(`${component.name.split(' ')[0].substr(0, 6)}${component.guid.split('-')[0]}`);
        this.guid = newGuid();
    }

    public getSource(parameter: string): string {
        return this.component.getAllInputs()
            .find(input => input.guid == parameter)
            ?.instanceGuid ?? "";
    }

    public setSource(parameter: string, source: string): void {
        this.component.getAllInputs()
            .find(input => input.guid == parameter)
            ?.setSource(source);
    }

    public draw(state?: string): void {
        // To be overridden by child class
        console.log('from parent');
    }

    public getParameterPosition(parameterId: string): number[] | undefined {
        const inputs = this.component.getAllInputs();
        const outputs = this.component.getAllOutputs();

        const inputIndex = inputs.map(i => i.instanceGuid).indexOf(parameterId);
        const outputIndex = outputs.map(o => o.instanceGuid).indexOf(parameterId);

        if (inputIndex < 0 && outputIndex < 0) {
            return undefined;
        }

        const isInput = inputIndex >= 0;
        const index = isInput ? inputIndex : outputIndex;
        const step = 5 / (isInput ? inputs.length : outputs.length);
        const dy = (step / 2) + (index * step);
        const dx = isInput ? -5 : 5;
        const p = this.component.position;

        return [p.x + dx, p.y - 2.5 + dy];
    }

    public attachToComponent(event: string, callback: () => any): void {
        // To be overridden by child class
    }

    public attachToParameter(event: string, callback: () => any, guid?: string): void {
        // To be overridden by child class
    }

}