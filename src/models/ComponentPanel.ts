import ResthopperComponent from 'resthopper/dist/models/ResthopperComponent';

export default interface ComponentPanel {
    component: ResthopperComponent;
    position: {
        x: number,
        y: number
    }
}