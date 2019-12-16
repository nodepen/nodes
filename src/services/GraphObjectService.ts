import { GrasshopperComponent } from "resthopper/dist/catalog/ComponentIndex";
import GlasshopperGraphObject from './../models/GlasshopperGraphObject';
import GenericComponent from './../models/components/GenericComponent';
import Resthopper from 'resthopper';
import ResthopperComponent from 'resthopper/dist/models/ResthopperComponent';

export function getGraphObjectByComponent(component: ResthopperComponent): GlasshopperGraphObject {
    switch(component.name) {
        default:
            return new GenericComponent(component);
    }
}