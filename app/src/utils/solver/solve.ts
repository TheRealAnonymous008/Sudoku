import { Cell } from "../logic/Cell";
import { TableState } from "../logic/rulesets/TableState";
import candidateElimination from "./basic-sudoku-strategies/candidate-elimination";
import { hiddenTuple } from "./basic-sudoku-strategies/hidden-tuple";
import intersectionRemoval from "./basic-sudoku-strategies/intersection-removal";
import {nakedTuple} from "./basic-sudoku-strategies/naked-tuples";
import single from "./basic-sudoku-strategies/singles";

export default function solve(table : TableState) : TableState {
    
    // Cell-based elimination
    for (let i = 0; i < table.cells.length; i ++) {
        for (let j = 0; j < table.cells[0].length; j++) {
            candidateElimination(table.cells[i][j]);

            nakedTuple(table.cells[i][j], table, 2);
            nakedTuple(table.cells[i][j], table, 3);
            nakedTuple(table.cells[i][j], table, 4);

            hiddenTuple(table.cells[i][j], table, 2);
            hiddenTuple(table.cells[i][j], table, 3);
            hiddenTuple(table.cells[i][j], table, 4);
        }
    }

    // Candidate based elimination
    for (let candidate = 1; candidate <= 9; candidate ++) {
        intersectionRemoval(table, candidate);
    }

    for (let i = 0; i < table.cells.length; i ++) {
        for (let j = 0; j < table.cells[0].length; j++) {
            single(table.cells[i][j]);
        }
    }

    return table;
}