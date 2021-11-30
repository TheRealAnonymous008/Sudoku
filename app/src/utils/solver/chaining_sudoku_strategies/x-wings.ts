import { TableState } from "../../logic/rulesets/TableState";

export default function XWing(table : TableState, n : number) : boolean {
    //  STRATEGY:           Select four tiles, such that they form a rectangle, as shown in the configuration below
    //                      ...   A  ...  B ... 
    //                      ...   C  ...  D ...

    //                      If A, B, C and D can be the candidate n, then every other entry in the corresponding rows and columns
    //                      cannot be n.

    //                      Alternatively, we can frame this as an intersection removal. 
    //                      R := R1 union R2 and
    //                      S := C1 union C2.
    
    return true;
}