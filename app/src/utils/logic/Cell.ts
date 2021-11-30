import { Rule } from "./Rule";

export interface Cell {
    row : number,
    column : number,
    regions: Cell[][],
    value : number,
    isGiven : boolean,
    candidates : number[],
    rules : Rule[]
}

export function intersects (c : Cell, o : Cell) : boolean {
    if (c.row === o.row && c.column === o.column)
        return false;
    
    if (c.value !== 0 || o.value !== 0)
        return false;

    for (let i = 0; i < c.candidates.length; i++) {
        if(o.candidates.includes(c.candidates[i]))
            return true;
    }
    return false;
}