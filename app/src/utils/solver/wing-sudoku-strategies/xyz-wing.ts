import cartesianProduct from "../../logic/cartesian-product";
import { Cell, getCommonCandidates, getNeighborhood, isNeighbors } from "../../logic/Cell";
import { Deduction, isValid } from "../../logic/Deduction";
import { getRegionIntersection, getRegionDifference } from "../../logic/Region";
import { getEmpty, TableState } from "../../logic/rulesets/TableState";
import { formsTuple} from "../basic-sudoku-strategies/naked-tuples";

export default function XYZWing(table : TableState) : Deduction{
    //      STRATEGY:           Let X, Y := be non neighboring cells
    //                          Let T:= be the region formed by the intersection of their neighborhoods
    //                          Let Z:= be one such element in T such that
    //                          X, Y, and Z form a naked triple and
    //                          Z contains 3 candidates, while X and Y contian AB and BC respectively.

    //                          By uniqueuness within a region, we eliminate B from the region Q, where
    //                          Q:= the intersection of the neighborhoods of X, Y and Z.

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
                if (formsXYZWing(cell, x, y)) {
                    const c = getCommonCandidates(x, y)[0];
                    deduction.cause = [cell, x, y];
                    
                    // We want the intersection of all 3 cells in the XYZ wing.
                    const Q = getRegionDifference(getRegionIntersection(T, getNeighborhood(cell)), [cell, x, y])
                    
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

export function formsXYZWing(hinge : Cell, x : Cell, y : Cell) : boolean{
    // The hinge must have all 3 candidates.
    if ( formsTuple([hinge, x], 2) || formsTuple([hinge, y], 2))
        return false

    if ( !formsTuple([hinge, x, y], 3))
        return false;

    // Ensure the hinge has all 3 candidates
    if (hinge.candidates.length ===3 && x.candidates.length === 2 && y.candidates.length === 2) {
        return true;
    }

    return false;
}