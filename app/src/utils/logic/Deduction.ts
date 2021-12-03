import { Cell } from "./Cell";

export type Deduction = {
    cause : Cell[],
    effect : Cell[];
}

export function isValid(d : Deduction) {
    return d.cause.length !== 0 && d.effect.length !== 0;
}