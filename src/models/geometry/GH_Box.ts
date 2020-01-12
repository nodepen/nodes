import GH_Interval from './GH_Interval';

export default interface GH_Box {
    Area: number,
    BoundingBox: any // TODO
    Center: {
        X: number,
        Y: number,
        Z: number
    },
    IsValid: boolean,
    Plane: any // TODO,
    Volume: number,
    X: GH_Interval,
    Y: GH_Interval,
    Z: GH_Interval
}