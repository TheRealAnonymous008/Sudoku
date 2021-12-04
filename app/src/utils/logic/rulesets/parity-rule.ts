import { Cell } from "../Cell";
import { RuleType } from "./Rule";
import { TableState } from "./TableState";

export function applyCellIsOdd (cell : Cell, table : TableState) {
    //  RULE:           The cell must have an odd value
    const rule = {
        cell : cell,
        table : table,
        type : RuleType.OddCell,
        isValid : (() => {
            return (cell.value !== 0) && cell.value%2 === 1;
        })
    }

    cell.rules.push(rule);
}

export function applyCellIsEven (cell : Cell, table : TableState) {
    //  RULE:           The cell must have an even value
    const rule = {
        cell : cell,
        table : table,
        type : RuleType.EvenCell,
        isValid : (() => {
            return (cell.value !== 0) && cell.value%2 === 0;
        })
    }

    cell.rules.push(rule);
}