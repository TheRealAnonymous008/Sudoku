import {isCellSatisfied } from "../logic/rulesets/TableState";
import { Cell } from "../logic/Cell";


export default function candidateElimination(cell : Cell) : Cell {

    // STRATEGY: Try all candidates and eliminate those that can be invalidated by a rule.

    if (cell.value !== 0)
        return cell;

    cell.candidates = cell.candidates.filter(
        (x : number, index : number) => {
            cell.value = x;
            let result = isCellSatisfied(cell);
            cell.value = 0;
            return result;
        }
    )

    return cell;
}