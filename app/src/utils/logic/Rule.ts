import { TableState } from "./rulesets/TableState";

export interface Rule {
    table : TableState
    isValid : () => boolean
}