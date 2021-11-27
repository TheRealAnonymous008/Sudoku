import { Rule } from "../Rule";
import { TableState } from "./TableState";

export default function applyNormalRules(table : TableState) {
    const rule : Rule = {
        table : table, 
        isValid: (() => 
        { 
            // Check rows for complete entries
            for(let i = 0; i < 9; i ++) {
                const rowSet = [];
                for (let j = 0; j  <9 ; j++) {
                    rowSet.push(table.cells[i][j].value)
                }
                
                for (let j = 1; j <= 9; j++) {
                    if(!rowSet.includes(j))
                        return false;
                }
            }

            // Check columns for complete entries
            for(let i = 0; i < 9; i ++) {
                const colSet = [];
                for (let j = 0; j  <9 ; j++) {
                    colSet.push(table.cells[j][i].value)
                }
                
                for (let j = 1; j <= 9; j++) {
                    if(!colSet.includes(j))
                        return false;
                }
            }

            // Check boxes for complete entries
            for(let i = 1; i < 9; i +=3) {
                for (let j = 1 ; j < 9; j += 3) {
                    const boxset = []

                    for (let x = -1; x <= 1; x ++) {
                        for (let y = -1; y <= 1; y++) {
                            boxset.push(table.cells[i + x][j + y].value);
                        }
                    }

                    for (let j = 1; j <= 9; j++) {
                        if(!boxset.includes(j))
                            return false;
                    }
                }
            }

            return true;
        })
    }

    table.rules.push(rule);
}