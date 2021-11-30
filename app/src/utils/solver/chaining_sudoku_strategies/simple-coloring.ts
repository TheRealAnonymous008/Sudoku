import { Cell, getElementsWithCandidate } from "../../logic/Cell";
import { TableState } from "../../logic/rulesets/TableState";

export default function simpleColoring (table :TableState, n : number) : boolean {
    // STRATEGY:        Consider one candidate n.
    //                  A chain is a series of links between cells such that : 
    //                      We consider cells with candidate n, such that they can be paired with another cell with candidate n in the same region.
    //                      A candidate can either be ON or OFF. The candidate is either the solution or it is not.
    //                      We color each cell as R or B, where R is either ON or OFF.      
    //                      The chain itself must be a bipartite graph. Cells alternate in colors.

    //                  Then follow these two rules for contradictions:
    //                      SUB-RULE 1:     Two colors in a region implies the color must be OFF. A region cannot have duplicates by uniqueness
    //                      SUB-RULE 2:     For any cell not on the chain, but which can see two colors on the chain, eliminate n from the
    //                                      options. At least one of the colors must be ON, therefore, the cell being n implies a contradiction

    // L := the list of all bivalue cells for a particular candidate.
    const L : Set<Cell> = new Set<Cell>();

    for (let i = 0; i < table.regions.length; i ++) {
        const cands = getElementsWithCandidate(table.regions[i], n);
        if (cands.length === 2) {
            for (let j = 0; j < cands.length; j++) {
                L.add(cands[j]);
            }
        }
    }

    const Lvals = L.values();
    
    // Iterate over the list of values and partition them into the sets B and R
    const B = [];
    const R = [];

    


    
    
    return true;
}