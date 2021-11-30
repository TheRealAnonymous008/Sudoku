import { Cell } from "../logic/Cell";
import { TableState } from "../logic/rulesets/TableState";
import candidateElimination from "./candidate-elimination";
import { hiddenTuple } from "./hidden-tuple";
import {nakedTuple} from "./naked-tuples";
import single from "./singles";

export default function solve(table : TableState) : TableState {
    
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

    for (let i = 0; i < table.cells.length; i ++) {
        for (let j = 0; j < table.cells[0].length; j++) {
            single(table.cells[i][j]);
        }
    }

    return table;
}