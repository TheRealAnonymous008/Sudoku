import { Cell } from "./Cell";

export enum RegionType {
    Row,
    Column,
    NormalBox,

}

export interface Region {
    cells : Cell[],
    type : RegionType
}

export function getRegionUnion (r : Cell[], s: Cell[]) : Cell[] {
    const result : Cell[] = [];
    
    for (let i = 0; i < s.length; i++) {
        result.push(s[i]);
    }

    for (let i = 0; i < r.length; i++) {
        if (!s.includes(r[i])) {
            result.push(r[i]);
        }
    }

    return result;
}

export function getRegionIntersection (r : Cell[], s : Cell[]) : Cell[] {
    const result  : Cell[] = [];
    for (let i = 0; i < r.length; i ++) {
        if (s.includes(r[i]))
            result.push(r[i]);
    }

    return result;
}

export function getRegionDifference (r : Cell[], s : Cell[]) : Cell[] {
    const result  : Cell[] = [];

    for (let i = 0; i < r.length; i ++) {
        if (!s.includes(r[i]))
            result.push(r[i]);
    }
    
    return result;
}

export function getElementsWithCandidate (r : Cell[], n : number) : Cell[] {
    let result  : Cell[] = [];
    for (let i = 0; i < r.length; i ++) {
        if (r[i].candidates.includes(n) && r[i].value === 0) {
            result.push(r[i]);
        }
        if (r[i].value === n) {
            return [];
        }
    }

    return result;
}

export function regionHasValue (r : Cell[], n : number) : boolean {
    for (let i = 0; i < r.length; i ++) {
        if (r[i].value === n) {
            return true;
        }
    }

    return false;
}


export function regionEliminateCandidate(r : Cell[], n : number) : boolean{
    const s : Cell[]= [];
    for (let i = 0; i < r.length; i ++) {
        if (r[i].candidates.includes(n) && r[i].value === 0) {
            s.push(r[i]);
        }
    }
    
    for (let i = 0; i < s.length; i++) {
        s[i].candidates = s[i].candidates.filter ( (value : number) => {return value !== n} );
    }

    return true;
}