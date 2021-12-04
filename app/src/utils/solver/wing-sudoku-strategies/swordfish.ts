import cartesianProduct from "../../logic/cartesian-product";
import { Cell, getRegionUnion } from "../../logic/Cell";
import { Deduction } from "../../logic/Deduction";
import { getAll, getEmpty, TableState } from "../../logic/rulesets/TableState";
import { regionElimination } from "../basic-sudoku-strategies/intersection-removal";

export default function Swordfish(table : TableState, n : number) : Deduction{
    //  STRATEGY:           Select nine tiles, such that they form a rectangle, as shown in the configuration below
    //                      ...   A1  ...  A2 ... A3 ... 
    //                      ...   B1  ...  B2 ... B3 ...
    //                      ...   C1  ...  C2 ... C3 ... 

    //                      If A1, ... , C3  can be the candidate n, then every other entry in the corresponding rows and columns
    //                      cannot be n.

    //                      Alternatively, we can frame this as an intersection removal. 
    //                      R := R1 union R2 union R3
    //                      C := C1 union C2 union C3


    let result : Deduction = {
        cause : [],
        effect : []
    }
    
    const blankCells = getEmpty(table);
    const flatttened = blankCells.flat();
    const matrix = cartesianProduct<Cell>(blankCells, blankCells);

    for (let i = 0 ; i < matrix.length; i ++) {
        for (let j = 0; j< flatttened.length; j++){
            const [x, y] = matrix[i];
            const z = flatttened[j];

            if (x.row !== y.row && x.column !== y.column 
                && x.row !== z.row && x.column !== z.column
                && y.row !== z.row && y.column !== z.column) {

                const R = getRegionUnion(getRegionUnion(x.regions[0], y.regions[0]), z.regions[0]);
                const C = getRegionUnion(getRegionUnion(x.regions[1], y.regions[1]), z.regions[1]);

                result = regionElimination(R, C, n);
                if (result.effect.length !== 0)
                    return result;
            }
        }
    }

    return result;
}