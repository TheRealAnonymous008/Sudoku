import { Cell } from "../logic/Cell";
import { TableState } from "../logic/rulesets/TableState";
import candidateElimination from "./candidate-elimination";
import single from "./singles";

export default function solve(table : TableState) : TableState {
    for (let i = 0; i < table.cells.length; i ++) {
        for (let j = 0; j < table.cells[0].length; j++) {
            table.cells[i][j] = candidateElimination(table.cells[i][j]);
        }
    }

    for (let i = 0; i < table.cells.length; i ++) {
        for (let j = 0; j < table.cells[0].length; j++) {
            table.cells[i][j] = single(table.cells[i][j]);
        }
    }

    return table;
}