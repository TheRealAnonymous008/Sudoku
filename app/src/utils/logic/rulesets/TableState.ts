import { Cell } from "../Cell";
import { Rule } from "../Rule";
import applyNormalRules from "./normal-rules";

export interface TableState{
    cells : Cell[][],
    rules : Rule[]
}

export function setValueAt (table : TableState, row : number, column : number, value : number) {
    if (row < 1 || column < 1 || value < 1 || row > 9 || column > 9 || value > 9) 
        return table;

    table.cells[row - 1][column - 1].value = value
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
                value : 0
            })
        }
        cells.push(temp);
    }

    let table  : TableState=  {
        cells : cells, 
        rules : []
    };

    table = applyRules(table);
    table = initializeTable(table);
    return table
}


export function applyRules (table : TableState) : TableState{
    applyNormalRules(table);
    return table;
}

export function initializeTable(table : TableState) : TableState{
    let grid = [ [8, 2, 7, 1, 5, 4, 3, 9, 6],
                 [9, 6, 5, 3, 2, 7, 1, 4, 8],
                 [3, 4, 1, 6, 8, 9, 7, 5, 2],
                 [5, 9, 3, 4, 6, 8, 2, 7, 1],
                 [4, 7, 2, 5, 1, 3, 6, 8, 9],
                 [6, 1, 8, 9, 7, 2, 4, 3, 5], 
                 [7, 8, 6, 2, 3, 5, 9, 1, 4], 
                 [1, 5, 4, 7, 9, 6, 8, 2, 3],
                 [2, 3, 9, 8, 4, 1, 5, 6, 7]]

    for (let i = 0; i < 9; i ++) {
        for (let j = 0; j < 9; j++) {
            setValueAt(table ,i + 1, j + 1, grid[i][j]);
        }
    }
    return table;
}