import { Cell } from "../../logic/Cell";
import { Deduction, isValid } from "../../logic/Deduction";
import { getElementsWithCandidate } from "../../logic/Region";
import { TableState } from "../../logic/rulesets/TableState";

export default function BUG(table : TableState) : Deduction{
    // Strategy :           This strategy stands for Bi-Value Universal Grave.
    //                      We check the grid to see if all but 1 cell is bi-value.
    //                      A bi-value cell is one which has a pair. 
    //                      The B.U.G is the only cell which has more than 2 candidates. 
    //                      The candidate to be chosen for the B.U.G, is the one which cannot be paired with another empty cell.

    let deduction : Deduction = {
        cause : [],
        effect : []
    }
    
    // We first check if the table is suitable for BUG.
    let bugCell : Cell | null= null;
    let bugfound : boolean = false
    const flattened = table.cells.flat();

    for (let i = 0; i < flattened.length; i++) {
        if (flattened[i].candidates.length !== 2 && flattened[i].value === 0) {
            if (bugfound){
                console.log(bugCell);
                return deduction;
            }
            else {
                bugCell = flattened[i];
                bugfound = true;
            }
        }
    }


    let found = false;
    // We then eliminate all candidates that can be paired.
    if (bugCell === null)  
        return deduction;
        
    for (let k = 0 ; k < bugCell.candidates.length; k ++){
        for (let i = 0; i < bugCell.regions.length; i++ ){
            const cands = getElementsWithCandidate(bugCell.regions[i].cells, bugCell.candidates[k]);
            if (cands.length !== 2) {
                // Found the correct value
                bugCell.value = bugCell.candidates[k];
                bugCell.candidates = [];
                found = true;
                break;
            }
        }
        if (found)
            break;
    }
    deduction.cause.push(bugCell);
    deduction.effect.push(bugCell);

    return deduction;
}