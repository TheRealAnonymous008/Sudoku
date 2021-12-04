import { Cell } from "../logic/Cell";
import { Deduction, isValid } from "../logic/Deduction";
import { TableState } from "../logic/rulesets/TableState";
import candidateElimination from "./basic-sudoku-strategies/candidate-elimination";
import { hiddenTuple } from "./basic-sudoku-strategies/hidden-tuple";
import intersectionRemoval from "./basic-sudoku-strategies/intersection-removal";
import {nakedTuple} from "./basic-sudoku-strategies/naked-tuples";
import single from "./basic-sudoku-strategies/singles";
import simpleColoring from "./chaining-sudoku-strategies/simple-coloring";
import XCycle from "./chaining-sudoku-strategies/x-cycles";
import BUG from "./uniqueness-rules/BUG";
import Swordfish from "./wing-sudoku-strategies/swordfish";
import XWing from "./wing-sudoku-strategies/x-wings";
import XYZWing from "./wing-sudoku-strategies/xyz-wing";
import YWing from "./wing-sudoku-strategies/y-wings";


export default function solve(table : TableState) : TableState {

    // Fundamental Strategies
    for (let i = 0; i < table.cells.length; i ++) {
        for (let j = 0; j < table.cells[0].length; j++) {
            candidateElimination(table.cells[i][j]);
        }
    }

    // It is essential to perform this once. This allows other algorithms reliant on candidates lists
    // to be updated.
    for (let i = 0; i < table.cells.length; i ++) {
        for (let j = 0; j < table.cells[0].length; j++) {
            if (single(table.cells[i][j]) ){
                console.log("[Singleton] r%d c%d has value %d", i + 1, j + 1, table.cells[i][j].value);
                table.deduction.push ({
                    cause : [table.cells[i][j]],
                    effect : [table.cells[i][j]]
                })
                return table;
            }
        }
    }
    table.deduction.push(performDeductions(table));

    return table;
}

function performDeductions(table : TableState) : Deduction {
    let deduction : Deduction
    
    for (let t = 2; t <= 4; t ++) {
        for (let i = 0; i < table.cells.length; i ++) {
            for (let j = 0; j < table.cells[0].length; j++) {
                deduction = nakedTuple(table.cells[i][j], table, t);
                if (isValid(deduction)) {
                    console.log("[Naked tuple] via cells: %s affecting %s", formatCellsAsString(deduction.cause) , formatCellsAsString(deduction.effect));
                    return deduction;
                }
            }
        }
    }

    for (let t = 2; t <= 4; t ++) {
        for (let i = 0; i < table.cells.length; i ++) {
            for (let j = 0; j < table.cells[0].length; j++) {
                deduction = hiddenTuple(table.cells[i][j], table, t);
                if (isValid(deduction)) {
                    console.log("[Hidden tuple] via cells: %s affecting %s", formatCellsAsString(deduction.cause) , formatCellsAsString(deduction.effect));
                    return deduction;
                }
            }
        }
    }

    for (let candidate = 1; candidate <= 9; candidate ++) {
        deduction = intersectionRemoval(table, candidate);
        if (isValid(deduction)) {
            console.log("[Intersection Removal] via candidate %d at cells %s affecting %s", candidate, formatCellsAsString(deduction.cause), formatCellsAsString(deduction.effect));
            return deduction;
        }

        deduction = XWing(table, candidate);
        if (isValid(deduction)) {
            console.log("[Classic X-Wing] via candidate %d at cells %s affecting %s", candidate, formatCellsAsString(deduction.cause), formatCellsAsString(deduction.effect));
            return deduction;
        }

        deduction = simpleColoring(table, candidate);
        if (isValid(deduction)) {
            console.log("[Simple Coloring] via candidate %d at cells %s affecting %s", candidate, formatCellsAsString(deduction.cause), formatCellsAsString(deduction.effect));
            return deduction;
        }
    }

    deduction = YWing(table);
    if (isValid(deduction)) {
        console.log("[Classic Y-Wing] via cells %s affecting %s", formatCellsAsString(deduction.cause), formatCellsAsString(deduction.effect));
        return deduction;
    }

    for (let candidate = 1; candidate <= 9; candidate ++) {
        deduction = Swordfish(table, candidate);
        if (isValid(deduction)) {
            console.log("[Swordish] via candidate %d at cells %s affecting %s", candidate, formatCellsAsString(deduction.cause), formatCellsAsString(deduction.effect));
            return deduction;
        }
    }

    deduction = XYZWing(table);
    if (isValid(deduction)) {
        console.log("[Classic XYZ-Wing] via cells %s affecting %s", formatCellsAsString(deduction.cause), formatCellsAsString(deduction.effect));
        return deduction;
    }

    deduction = BUG(table);
    if (isValid(deduction)) {
        console.log("[B.U.G] via cells %s affecting %s", formatCellsAsString(deduction.cause), formatCellsAsString(deduction.effect));
        return deduction;
    }

    for (let candidate = 1; candidate <= 9; candidate ++) {
        deduction = XCycle(table, candidate);
        if (isValid(deduction)) {
            console.log("[X-Cycles] via candidate %d at cells %s affecting %s", candidate, formatCellsAsString(deduction.cause), formatCellsAsString(deduction.effect));
            return deduction;
        }
    }

    return deduction;
}

function formatCellsAsString(cells : Cell[]) : String {
    let str = ""
    cells.forEach(element => {
        str +=  ("[" + [element.row, element.column] + "] ")
    });
    return str;
}