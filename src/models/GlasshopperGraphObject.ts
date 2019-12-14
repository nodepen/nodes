import ResthopperComponent from 'resthopper/dist/models/ResthopperComponent';
import { SvgarSlab } from 'svgar';
import { newGuid } from './../utils/newGuid';

export default class GlasshopperGraphObject {

    public readonly component: ResthopperComponent;
    public readonly svgar: SvgarSlab;
    public readonly guid: string;
    public readonly cache: { [param: string]: any | undefined } = {};

    constructor(component: ResthopperComponent) {
        this.component = component;
        this.component.getAllOutputs().forEach(p => this.cache[p.name] = undefined);
        this.svgar = new SvgarSlab(`${component.guid.split('-')[0]}${component.name}`);
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
}