import { Cell } from "../Cell";
import { Rule } from "../Rule";
import applyNormalRules from "./normal-rules";

export interface TableState{
    cells : Cell[][]
}

export function setValueAt (table : TableState, row : number, column : number, value : number) {
    if (row < 1 || column < 1 || value < 1 || row > 9 || column > 9 || value > 9) 
        return table;

    table.cells[row - 1][column - 1].value = value;
}

export function generateTable () : TableState{
    const cells = [];
    for(let i = 0; i < 9; i++) {
        const temp = []
        for(let j = 0; j < 9 ; j++) {
            temp.push ({
                row: i + 1,
                column : j + 1, 
                box : i,
                value : 0,
                isGiven : false,
                candidates : [1, 2, 3, 4, 5, 6, 7, 8, 9],
                rules : []
            })
        }
        cells.push(temp);
    }

    let table  : TableState=  {
        cells : cells
    };

    table = applyRules(table);
    table = initializeTable(table);
    return table
}


export function applyRules (table : TableState) : TableState{
    applyNormalRules(table);
    return table;
}

export function isCellSatisfied(cell :Cell) : boolean {
    for (let i = 0; i < cell.rules.length; i++) {
        if (! cell.rules[i].isValid())
            return false;
    }
    return true;
}

export function isTableSatisfied (table : TableState) : boolean {
    for (let i = 0; i < table.cells.length; i++) {
        for (let j = 0; j < table.cells[0].length; j++) {
            if (!isCellSatisfied(table.cells[i][j]))
                return false;
        }
    }
    return true;
}

export function initializeTable(table : TableState) : TableState{
    let grid = [ [8, 2, 7, 1, 5, 4, 3, 9, 6],
                 [9, 6, 5, 3, 2, 7, 1, 4, 8],
                 [3, 4, 1, 6, 8, 9, 7, 5, 2],
                 [5, 9, 3, 4, 6, 8, 2, 7, 1],
                 [4, 7, 2, 5, 0, 3, 6, 8, 9],
                 [6, 1, 8, 9, 7, 2, 4, 3, 5], 
                 [7, 8, 6, 0, 0, 0, 9, 1, 4], 
                 [1, 5, 4, 0, 0, 0, 8, 2, 0],
                 [2, 3, 9, 0, 0, 0, 5, 6, 0]]

    for (let i = 0; i < 9; i ++) {
        for (let j = 0; j < 9; j++) {
            setValueAt(table ,i + 1, j + 1, grid[i][j]);
            if (grid[i][j] !== 0 ) {
                 table.cells[i][j].isGiven = true;
            }
        }
    }
    return table;
}