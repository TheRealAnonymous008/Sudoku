import { Rule } from "./Rule";

export interface Cell {
    row : number,
    column : number,
    box : number, 
    value : number,
    isGiven : boolean,
    candidates : number[],
    rules : Rule[]
}