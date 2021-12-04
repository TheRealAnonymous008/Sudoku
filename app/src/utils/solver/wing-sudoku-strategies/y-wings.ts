import cartesianProduct from "../../logic/cartesian-product";
import { Cell, getCommonCandidates, getNeighborhood, isNeighbors } from "../../logic/Cell";
import { Deduction, isValid } from "../../logic/Deduction";
import { getRegionIntersection, getRegionDifference } from "../../logic/Region";
import { getEmpty, TableState } from "../../logic/rulesets/TableState";
import { formsTuple} from "../basic-sudoku-strategies/naked-tuples";

export default function YWing(table : TableState) : Deduction{
    //      STRATEGY:           Let X, Y:= be non-neighboring cells.
    //                          Let T:= be the region formed by the intersection of their neighborhoods
    //                          Let Z := be one such element in T such that
    //                          X, Y, and Z form a naked triple of the form AC, BC and AB, respectively for candidates A,B,C.
    
    //                          Q:= T- [Z]. Eliminate from Q the candidate C. 

    let deduction : Deduction = {
        cause : [],
        effect : []
    }

    const blankCells : Cell[] = getEmpty(table);
    const matrix = cartesianProduct(blankCells, blankCells);

    for (let i = 0 ; i < matrix.length; i ++) {
        const [x, y] = matrix[i];
        if (isNeighbors(x, y) === 0 && (x.row !== y.row || x.column !== y.column)) {
            let T = getRegionIntersection(getNeighborhood(x), getNeighborhood(y));
            T = T.filter((cell : Cell) => {return cell.value === 0});

            for (let i = 0; i < T.length; i++){
                const cell = T[i];
                if (formsYWing(cell, x, y)) {
                    const c = getCommonCandidates(x, y)[0];
                    deduction.cause = [cell, x, y];

                    const Q = getRegionDifference(T, [cell]);
                    
                    for (let i = 0; i < Q.length; i++) {
                        Q[i].candidates = Q[i].candidates.filter((value : number) => {
                            if (value === c) {
                                deduction.effect.push(Q[i]);
                            }
                            return value !== c});
                    };
                    
                    if (isValid(deduction)){
                        return deduction;
                    }
                }
            }
        }
    }


    return deduction;
}


export function formsYWing(pivot : Cell, x : Cell, y : Cell) : boolean {
    // Rules out naked pairs.
    if ( formsTuple([pivot, x], 2) || formsTuple([pivot, y], 2) || formsTuple([x, y], 2))
        return false

    if ( !formsTuple([pivot, x, y], 3))
        return false;

    // Rules out the possibility of triples where oen cell has 3 candidates.
    if (pivot.candidates.length ===2 && x.candidates.length === 2 && y.candidates.length === 2) {
        return true;
    }

    return false;
}