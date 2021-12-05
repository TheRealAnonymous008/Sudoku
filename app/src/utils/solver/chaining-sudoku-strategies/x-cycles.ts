import { Cell, isNeighbors } from "../../logic/Cell";
import { Deduction } from "../../logic/Deduction";
import { getElementsWithCandidate } from "../../logic/Region";
import { TableState } from "../../logic/rulesets/TableState";

export type Cycle = {
    strongLinks : CycleNode[][],
    weakLinks : CycleNode[][],
    cells : CycleNode[]
}

export type CycleNode ={
    cells : Cell[]          // This will be useful for grouped x cycles
    visited : false
};

export default function XCycle (table : TableState, n : number) : Deduction {
    
    // STRATEGY:                We extend the notion of simple coloring by defining STRONG and WEAK links.
    //                          A link is STRONG if it gives a strong inference, that is, exactly one of the links must be n
    //                                  (i.e., in the algorithm, they are what's linked by both adjacency and candidate-presence)
    //                          A link is WEAK if it gives a weak inference. That is, we cannot deduce which end is n.
    //                                  (i.e., in the algorithm they are what's linked by adjacency only)
    //                          We also ensure that the chain forms a cycle, that is, the start and end are the same.

    //We follow the following rules to eliminate candidates.
    //                          SUB-RULE 1:         If the loop has even length, we eliminate candidates off-cycle that see two colors.
    //                          SUB-RULE 2:         If the loop has odd length, we consider two subcases for a discontinuous node X on the cycle
    //                                     2a       If node X is connected via two strong links, then, X must be n.
    //                                              For if not, then we will have no place to put n to satisfy the candidate uniqueness constraint.
    //                                      2b      If node X is connected via two weak links, then X cannot be n.
    //                                              For if not, then we will have a weak cell seeing two colors, and ruling both colors as not n.
    //                                              Contradicting the assumption that 1 color will be n.

    const deduction : Deduction= {
        cause : [],
        effect : []
    }

    // We form the xcycle as necessary. 
    let cycle: Cycle = formCycle(table, n);

    // let cells : Cell[]= []
    // for (let i = 0; i < cycle.cells.length; i++) {
    //     if (cycle.cells.length === 1)
    //         cells.push(cycle.cells[i].cells[0]);
    // }
    // // We then color the cycle
    // let B : Bipartition = bipartition(cells);

    // // We implement each rule, considering both cases of odd and even length cycles
    // console.log(cycle);
    // deduction.cause = cells
    // if (cycle.cells.length % 2 === 0 && cycle.cells.length !== 0) {
    //     deduction.effect = checkOffChain(table, B, n);
    // } else {
    //     deduction.effect = checkOnCycle(cycle, n);
    // }

    return deduction;
}

export function checkOnCycle (cycle : Cycle, n : number) : Cell[]{
    let discontinuity : CycleNode = cycle.cells[0];
    let found = false;

    // We find the discontinuity. The discontinuity must occur as the intersection of two strong links or two weak links
    for (let i = 0; i < cycle.strongLinks.length; i++) {
        const a  = cycle.strongLinks[i][0];
        const b = cycle.strongLinks[i][1];

        for (let j = i + 1; j < cycle.strongLinks.length; j++) {
            const x  = cycle.strongLinks[j][0];
            const y = cycle.strongLinks[j][1];

            if (a === x || a === y) {
                found = true;
                discontinuity = a;
                break;
            }
            if (b === x || b === y) {
                found = true;
                discontinuity = b;
                break;
            }
        }
        if (found)
            break;
    }
    // CASE 1: We found two strong links together, the value at the discontinuity must be n
    if (found){
        for (let i = 0; i < discontinuity.cells.length; i++) {
            discontinuity.cells[i].candidates = [n];
        }
        return discontinuity.cells;
    } 

    // We find based on the weak links
    for (let i = 0; i < cycle.weakLinks.length; i++) {
        const a  = cycle.weakLinks[i][0];
        const b = cycle.weakLinks[i][1];

        for (let j = i + 1; j < cycle.weakLinks.length; j++) {
            const x  = cycle.weakLinks[j][0];
            const y = cycle.weakLinks[j][1];

            if (a === x || a === y) {
                found = true;
                discontinuity = a;
                break;
            }
            if (b === x || b === y) {
                found = true;
                discontinuity = b;
                break;
            }
        }

        if (found)
            break;
    }

    // CASE 2: We found two weak links together. The value cannot be n
    if (found) {
        for (let i = 0; i < discontinuity.cells.length; i++) {
            discontinuity.cells[i].candidates = discontinuity.cells[i].candidates.filter((value) => {return value !== n});
        }
        return discontinuity.cells;
    }

    return [];
}


export function formCycle (table : TableState, n : number) : Cycle {
    const cycle :Cycle = {
        cells : [],
        strongLinks : [],
        weakLinks : []
    }

    let strongPairs : number[][] = [];
    let weakPairs : number[][] = [];
    let cells : Cell[]= []


    // We first get all the nodes that could be a part of the cycle. This also guarantees us the strong and weak links.
    for (let i = 0; i < table.regions.length; i ++) {
        const cands = getElementsWithCandidate(table.regions[i].cells, n);
        // We ensure that the selected cells intersect at exactly 1 region. This accounts for all strong links.
        if (cands.length === 2) { 
            if (isNeighbors(cands[0], cands[1])  > 0){
                if (!cells.includes(cands[0]))
                    cells.push(cands[0]);
                if (!cells.includes(cands[1]))
                    cells.push(cands[1]);

                strongPairs.push([cells.indexOf(cands[0]), cells.indexOf(cands[1])]);
            } 
        }
        else if (cands.length > 2) { 
            // We add all possible pairs
            for (let x = 0 ; x < cands.length; x ++) {
                for (let y = x  +1; y < cands.length; y++) {
                    if (isNeighbors(cands[x], cands[y])  > 0){
                        if (!cells.includes(cands[x]))
                            cells.push(cands[x]);
                        if (!cells.includes(cands[y]))
                            cells.push(cands[y]);
                        
                        weakPairs.push([cells.indexOf(cands[x]), cells.indexOf(cands[y])]);
                    }
                }
            } 
        }
    }
    
    // We ensure all entries in strong and weak pairs are unique
    strongPairs = strongPairs.filter( (value, index) => {
        for (let i = index + 1; i < strongPairs.length; i++) {
            const [a, b] = value;
            const [c, d] = strongPairs[i];
            if( (a === c && b === d ) ||
                (a === d && b === c) )
                return false;
        }
        return true;
    })

    weakPairs = weakPairs.filter( (value, index) => {
        for (let i = index + 1; i < weakPairs.length; i++) {
            const [a, b] = value;
            const [c, d] = weakPairs[i];
            if( (a === c && b === d ) ||
                (a === d && b === c) )
                return false;
        }
        return true;
    })

    // We build cycle nodes, and express all strong and weak links in terms of these cycles.
    let nodes : CycleNode[] = [];
    for (let i = 0; i < cells.length; i++) {
        nodes.push( {
            cells : [cells[i]],
            visited : false
        })
    }

    // We build the cycle here.

    
    console.log(n, strongPairs, weakPairs);
    console.log("Nodes", cells);
    return cycle;
}

export function buildXCycle(nodes : CycleNode[], strongLinks : CycleNode[], weakLinks : CycleNode[]) {

}