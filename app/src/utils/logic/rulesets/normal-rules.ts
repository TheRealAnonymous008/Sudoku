import { table } from "console";
import { Cell } from "../Cell";
import { Rule } from "../Rule";
import { TableState } from "./TableState";

export default function applyNormalRules(table : TableState) {
    for (let i = 0; i < table.cells.length; i++) {
        for (let j = 0; j < table.cells[0].length; j++ ) {
            applyRowRule(table.cells[i][j], table);
            applyColumnRule(table.cells[i][j], table);
        }
    }

    // Apply box rules
    for (let i = 1; i < table.cells.length; i+=3) {
        for (let j = 1; j < table.cells[0].length; j+=3 ) {
            const region = [
                table.cells[i - 1][j - 1],
                table.cells[i - 1][j],
                table.cells[i - 1][j + 1],
                table.cells[i][j - 1],
                table.cells[i][j],
                table.cells[i][j + 1],
                table.cells[i + 1][j - 1],
                table.cells[i + 1][j],
                table.cells[i + 1][j + 1],
            ];

            for (let k = 0 ; k < 9; k ++)
                applyBoxRule(region[k], table, region)
        }
    }

}

export function applyRowRule(cell : Cell, table : TableState) {
    // RULE: This cell's entry must be the only one in its row.
    const rule = {
        cell : cell, 
        table : table,
        isValid : (() => {
            if (cell.value === 0)
                return false;

            for (let j = 0; j  <9 ; j++) {
                const other = table.cells[cell.row - 1][j].value;
                if (j !== cell.column - 1) {
                    if (other === cell.value)
                        return false;
                }
            }
            return true;
        })
    }
    cell.rules.push(rule);
}

export function applyColumnRule(cell : Cell, table : TableState) {
    // RULE : This cell's entry must be the only one in its column
    const rule = {
        cell : cell, 
        table : table,
        isValid : (() => {
            if (cell.value === 0)
                return false;

            for (let i = 0; i  <9 ; i++) {
                const other = table.cells[i][cell.column - 1].value;
                if (i !== cell.row - 1) {
                    if (other === cell.value)
                        return false;
                }
            }

            return true;
        })
    }
    
    cell.rules.push(rule);
}

export function applyBoxRule(cell : Cell, table : TableState, region : Cell[]) {
    // RULE : This cell's entry must be the only one in its box
    const rule = {
        cell : cell, 
        table : table,
        isValid : (() => {
            if (cell.value === 0)
                return false;

            for (let i = 0; i < region.length; i++) {
                const other = region[i].value;
                if (! (region[i].row === cell.row && region[i].column === cell.column)) {
                    if (other === cell.value)
                        return false;
                }
            }

            return true;
        })
    }
    
    cell.rules.push(rule);
}