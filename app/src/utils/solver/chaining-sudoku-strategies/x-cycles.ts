import { Deduction } from "../../logic/Deduction";
import { TableState } from "../../logic/rulesets/TableState";

export default function (table : TableState) : Deduction {
    const deduction = {
        cause : [],
        effect : [];
    }

    return deduction;
}