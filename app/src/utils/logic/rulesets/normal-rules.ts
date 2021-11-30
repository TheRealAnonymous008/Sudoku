import { table } from "console";
import { Cell } from "../Cell";
import { Rule } from "../Rule";
import { TableState } from "./TableState";

export default function applyNormalRules(table : TableState) {
    // Apply row rules
    for (let i = 0; i < table.cells.length; i++) {
        const region  : Cell[] = []
        for (let k = 0; k < table.cells[i].length; k++) {
            region.push(table.cells[i][k]);
        }

        for (let k = 0 ; k < 9; k ++) {
            applyRegionRule(region[k], table, region)
            region[k].regions.push(region);
        }

        table.regions.push(region);
    }

    // Apply column rules
    for (let i = 0; i < table.cells[0].length; i++) {
        const region  : Cell[] = []
        for (let k = 0; k < table.cells.length; k++) {
            region.push(table.cells[k][i]);
        }

        for (let k = 0 ; k < 9; k ++) {
            applyRegionRule(region[k], table, region)
            region[k].regions.push(region);
        }

        table.regions.push(region);
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

            for (let k = 0 ; k < 9; k ++) {
                applyRegionRule(region[k], table, region)
                region[k].regions.push(region);
            }

            table.regions.push(region);
        }
    }

}

export function applyRegionRule(cell : Cell, table : TableState, region : Cell[]) {
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