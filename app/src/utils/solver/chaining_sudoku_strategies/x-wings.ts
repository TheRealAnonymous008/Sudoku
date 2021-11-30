import cartesianProduct from "../../logic/cartesian-product";
import { Cell, getRegionUnion } from "../../logic/Cell";
import { getAll, TableState } from "../../logic/rulesets/TableState";
import { regionElimination } from "../basic-sudoku-strategies/intersection-removal";

export default function XWing(table : TableState, n : number) : boolean {
    //  STRATEGY:           Select four tiles, such that they form a rectangle, as shown in the configuration below
    //                      ...   A  ...  B ... 
    //                      ...   C  ...  D ...

    //                      If A, B, C and D can be the candidate n, then every other entry in the corresponding rows and columns
    //                      cannot be n.

    //                      Alternatively, we can frame this as an intersection removal. 
    //                      R := R1 union R2 and
    //                      C := C1 union C2.

    const blankCells = getAll(table);
    const matrix = cartesianProduct<Cell>(blankCells, blankCells);
    let fresult = false;

    for (let i = 0 ; i < matrix.length; i ++) {
        const [x, y] = matrix[i];
        if (x.row < y.row && x.column < y.column) {
            const R = getRegionUnion(x.regions[0], y.regions[0]);
            const C = getRegionUnion(x.regions[1], y.regions[1]);

           const result = regionElimination(R, C, n);
            if (result) {
                fresult = true;
                console.log ('[Classic X-Wing] found at r%d c%d and r%d c%d for value %d', x.row, x.column, y.row, y.column, n);
            }
        }
    }

    return fresult;
}