import { getRegionDifference, getRegionUnion, Region } from "./Region";
import { Rule } from "./Rule";

export interface Cell {
    row : number,
    column : number,
    regions: Region[],
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



export function getNeighborhood(c : Cell) : Cell[] {
    let neighborhood  : Cell[] = [];
    
    for (let i = 0; i <c.regions.length; i++) {
        neighborhood = getRegionUnion(neighborhood, c.regions[i].cells);
    }

    neighborhood = getRegionDifference(neighborhood, [c]);

    return neighborhood;
}

export function isNeighbors(c : Cell, d : Cell) : number{
    let rneighbor : number = 0;

    if (c.row === d.row && c.column === d.column)
        return 0;

    for (let i = 0; i < c.regions.length; i ++) {
        if (c.regions[i].cells.includes(d)) {
            rneighbor ++
        }
    }

    return rneighbor;
}

export function getCommonCandidates(c : Cell, d : Cell) : number[] {
    let inter : number[] = [];

    if (c.value !== 0 || d.value !== 0)
        return inter;

    for (let i = 0; i < c.candidates.length; i++) {
        if (d.candidates.includes(c.candidates[i])){
            inter.push(c.candidates[i]);
        }
    }
    return inter;
}