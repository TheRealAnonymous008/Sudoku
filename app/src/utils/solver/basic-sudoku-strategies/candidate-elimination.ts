import {isCellSatisfied } from "../../logic/rulesets/TableState";
import { Cell } from "../../logic/Cell";


export default function candidateElimination(cell : Cell)  {

    // STRATEGY: Try all candidates and eliminate those that can be invalidated by a rule.

    if (cell.value !== 0) {
        cell.candidates = [];
        return;
    }

    cell.candidates = cell.candidates.filter(
        (x : number, index : number) => {
            cell.value = x;
            let result = isCellSatisfied(cell);
            cell.value = 0;
            return result;
        }
    )
}