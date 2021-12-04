import { Cell } from "../Cell";
import { TableState } from "./TableState";

export enum RuleType {
    Normal,
    OddCell,
    EvenCell
}

export interface Rule {
    table : TableState
    cell : Cell,
    type : RuleType,
    isValid : () => boolean
}

export function getRuleOfType (cell : Cell, type : RuleType) : Rule | null {
    for (let i = 0; i < cell.rules.length; i++) {
        if (cell.rules[i].type === type)
            return cell.rules[i];
    }

    return null;
}