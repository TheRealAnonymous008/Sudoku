import { Cell, intersects } from "../logic/Cell";
import { isCellSatisfied, TableState } from "../logic/rulesets/TableState";

export function nakedTuple(cell : Cell, table : TableState, t : number){
    // STRATEGY:    By the fact each region must contain unique entries, 
    //              If the candidates for two related cells are exactly the same, then we eliminate those entries from other entries
    //              In the appropriate region.

    if (cell.value === 0 && cell.candidates.length <= t) {
        let candidatesList : Cell[] = [];
        for (let r = 0; r < cell.regions.length; r++) {
            candidatesList = [];
            candidatesList.push(cell);

            for (let c = 0; c < cell.regions[r].length; c++) {
                const other = cell.regions[r][c];
                if (intersects(cell, other)){
                    candidatesList.push(other);
                }
            }

            candidatesList = pruneNonTuple(candidatesList, t);

            if (formsTuple(candidatesList)) {
                for (let c = 0; c < cell.regions[r].length ; c++) {
                    const other = cell.regions[r][c];
                    if (!candidatesList.includes(other)) {
                        eliminateCandidates(other, getRunningList(candidatesList));
                    }
                }
                if (t <= 4)
                    console.log("[Naked %d-tuple] found in region via cell r%d c%d", t, cell.row, cell.column);
                else 
                    console.log("[Hidden %d-tuple] found in region via cell r%d c%d", 9 - t, cell.row, cell.column);
            }
        }
        return;
        
    }
}


export function pruneNonTuple(cells : Cell[], n : number) : Cell[] {
    if (cells.length <= n)
        return cells;

    const runningList = getRunningList(cells);
    let tuple : Cell[] = [];

    // Find the proper tuple.
    // SUB-STRATEGY 1:   We remove elements where the number of candidates is larger than n. This is because these cannot
    //                   Be part of the tuple at the tuple must have cells with at most n candidates.

    cells = cells.filter ( (cell :Cell) => {
        return cell.candidates.length <= n;
    });

    // SUB-STRATEGY2:   This leaves us with elements where the candidate list is at most n-units long. We then examine these
    //                  Remaining cells and find the n-tuple.
    for(let hash = 1 ; hash < 2**(cells.length); hash++) {
        let ctr = hash;
        let power = cells.length - 1;

        while (ctr > 0) {
            if (2 ** power > ctr) {
                power -= 1;
            } else {
                ctr = ctr - 2 ** power;
                tuple.push(cells[power]);
                power -= 1;
            }
        }
        if (tuple.length === n && getRunningList(tuple).length === 3 ){
            break;
        }
        tuple = [];
    }


    // Then remove the tuple from the list
    cells = cells.filter( (value : Cell) => {
        return tuple.includes(value);
    });

    return cells;
}

export function eliminateCandidates(cell : Cell, candidates : number[]) {
    cell.candidates = cell.candidates.filter((val :number) => (
        !candidates.includes(val)
    ));
}

export function getRunningList(cells : Cell[]){
    const runningList : number[] = [];

    for (let c = 0; c < cells.length; c++) {
        for (let x = 0; x < cells[c].candidates.length; x++) {
            if(! (runningList.includes(cells[c].candidates[x])))
            runningList.push(cells[c].candidates[x]);
        }
    }
    return runningList;
}

export function formsTuple(cells : Cell[]) : boolean{
    if (cells.length === 0)
        return false;
        
    return getRunningList(cells).length === cells.length;
}
