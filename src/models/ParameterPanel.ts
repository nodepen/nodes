import ResthopperParameter from 'resthopper/dist/models/ResthopperParameter';

export default interface ParameterPanel {
    parameter: ResthopperParameter;
    position: {
        x: number,
        y: number
    }
    value: any;
}