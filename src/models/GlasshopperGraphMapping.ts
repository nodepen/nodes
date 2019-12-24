import GlasshopperGraphObject from './GlasshopperGraphObject';
import ResthopperComponent from 'resthopper/dist/models/ResthopperComponent';
import ResthopperParameter from 'resthopper/dist/models/ResthopperParameter';

export default interface GlasshopperGraphMapping {
    [svgarGuid: string]: {
        object: GlasshopperGraphObject;
        component: ResthopperComponent;
        parameter: ResthopperParameter | undefined;
    };
  }