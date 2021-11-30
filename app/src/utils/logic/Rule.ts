import { Cell } from "./Cell";
import { TableState } from "./rulesets/TableState";

export interface Rule {
    table : TableState
    cell : Cell
    isValid : () => boolean
}