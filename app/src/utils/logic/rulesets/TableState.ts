import { Cell } from "../Cell";
import { Deduction } from "../Deduction";
import { Region } from "../Region";
import { Rule } from "./Rule";
import applyNormalRules from "./normal-rules";
import { applyCellIsEven, applyCellIsOdd } from "./parity-rule";

export interface TableState{
    cells : Cell[][],
    regions : Region[],
    deduction: Deduction[]
}

export function setValueAt (table : TableState, row : number, column : number, value : number, given : boolean = false) {
    if (row < 1 || column < 1 || value < 0 || row > 9 || column > 9 || value > 9) 
        return table;

        
    table.cells[row - 1][column - 1].isGiven = given
    
    if (value === 0) {
        table.cells[row - 1][column - 1].candidates = [1,2,3,4,5,6,7,8,9];
        table.cells[row - 1][column - 1].isGiven = false;
    } else {
        table.cells[row - 1][column - 1].candidates = [];
    }

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
                value : 0,
                isGiven : false,
                candidates : [1, 2, 3, 4, 5, 6, 7, 8, 9],
                rules : [],
                regions : []
            })
        }
        cells.push(temp);
    }

    let table  : TableState=  {
        cells : cells,
        regions : [],
        deduction :[]
    };

    table = applyRules(table);
    table = initializeTable(table);
    return table
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

export function getEmpty (table : TableState) : Cell[] {
    const result : Cell[] = [];
    for (let i = 0; i < table.cells.length ; i ++) {
        for (let j = 0; j < table.cells[0].length; j++) {
            if (table.cells[i][j].value === 0)
                result.push(table.cells[i][j]);
        }
    }

    return result;
}

export function getAll (table : TableState) : Cell[] {
    const result : Cell[] = [];
    for (let i = 0; i < table.cells.length ; i ++) {
        for (let j = 0; j < table.cells[0].length; j++) {
            result.push(table.cells[i][j]);
        }
    }

    return result;
}

export function getRecentDeduction(table : TableState) : Deduction {
    if (table.deduction.length > 0)
        return table.deduction[table.deduction.length - 1];
    return {
        cause : [],
        effect : []
    }
}

export function initializeTable(table : TableState) : TableState{

    let empty = 
                [   
                    [0, 0, 0,   0, 0, 0,   0, 0, 0],
                    [0, 0, 0,   0, 0, 0,   0, 0, 0],
                    [0, 0, 0,   0, 0, 0,   0, 0, 0],

                    [0, 0, 0,   0, 0, 0,   0, 0, 0],
                    [0, 0, 0,   0, 0, 0,   0, 0, 0],
                    [0, 0, 0,   0, 0, 0,   0, 0, 0], 

                    [0, 0, 0,   0, 0, 0,   0, 0, 0], 
                    [0, 0, 0,   0, 0, 0,   0, 0, 0],
                    [0, 0, 0,   0, 0, 0,   0, 0, 0]
                ]
    let xcycle = 
                [   
                    [0, 0, 4,   5, 0, 7,   0, 0, 0],
                    [0, 0, 3,   6, 0, 0,   0, 8, 0],
                    [6, 0, 0,   0, 8, 0,   0, 0, 4],

                    [0, 0, 0,   1, 0, 0,   0, 7, 0],
                    [5, 0, 0,   7, 0, 8,   0, 0, 6],
                    [0, 8, 0,   0, 0, 3,   0, 0, 0], 

                    [2, 0, 0,   0, 5, 0,   0, 0, 3], 
                    [0, 5, 0,   0, 0, 1,   2, 0, 0],
                    [0, 0, 0,   4, 0, 6,   5, 0, 0]
                ]
    let xcycle2 = 
                [   
                    [0, 0, 6,   2, 0, 0,   4, 0, 0],
                    [0, 9, 4,   0, 0, 0,   0, 6, 0],
                    [2, 0, 0,   4, 0, 0,   0, 0, 7],

                    [0, 0, 0,   3, 7, 0,   0, 0, 0],
                    [7, 4, 0,   0, 9, 0,   0, 1, 6],
                    [0, 0, 0,   0, 8, 4,   0, 0, 0], 

                    [3, 0, 0,   0, 0, 6,   0, 0, 5], 
                    [0, 8, 0,   0, 0, 0,   7, 3, 0],
                    [0, 0, 7,   0, 0, 3,   6, 0, 0]
                ]
    let grid = empty;

    for (let i = 0; i < 9; i ++) {
        for (let j = 0; j < 9; j++) {
            setValueAt(table ,i + 1, j + 1, grid[i][j], true);
        }
    }
    return table;
}

export function applyRules (table : TableState) : TableState{
    applyNormalRules(table);
    return table;
}