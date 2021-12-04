import { Cell, isNeighbors } from "../../logic/Cell";
import { Deduction } from "../../logic/Deduction";
import { getElementsWithCandidate } from "../../logic/Region";
import { TableState } from "../../logic/rulesets/TableState";
import { bipartition, Bipartition, checkOffChain, find, union, UnionFindNode } from "./simple-coloring";

export type Cycle = {
    strongLinks : Cell[][],
    weakLinks : Cell[][],
    cells : Cell[]
}

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
    // We then color the cycle
    let B : Bipartition = bipartition(cycle.cells);

    // We implement each rule, considering both cases of odd and even length cycles
    
    deduction.cause = cycle.cells;
    if (cycle.cells.length % 2 === 0 && cycle.cells.length !== 0) {
        deduction.effect = checkOffChain(table, B, n);
    } else {
        deduction.effect = checkOnCycle(cycle, n);
    }

    return deduction;
}

export function checkOnCycle (cycle : Cycle, n : number) : Cell[]{
    let discontinuity : Cell = cycle.cells[0];
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
        discontinuity.candidates = [n];
        return [discontinuity];
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
        discontinuity.candidates = discontinuity.candidates.filter((value) => {return value !== n});
        return [discontinuity];
    }

    return [];
}


export function formCycle (table : TableState, n : number) : Cycle {
    const cycle :Cycle = {
        cells : [],
        strongLinks : [],
        weakLinks : []
    }
    // ALGORITHM   :       Perform Union-Find on the set of cells. This produces a list of disjoint sets
    //                     Which can then be traversed and colored via BFS
    let ufnodes : UnionFindNode<Cell>[] = [] ;
    let strongPairs : number[][] = [];
    let weakPairs : number[][] = [];
    let nodes : Cell[]= []


    // We first get all the nodes that could be a part of the cycle.
    for (let i = 0; i < table.regions.length; i ++) {
        const cands = getElementsWithCandidate(table.regions[i].cells, n);
        // We ensure that the selected cells intersect at exactly 1 region. This accounts for all strong links.
        if (cands.length === 2) { 
            if (isNeighbors(cands[0], cands[1])  == 1){
                if (!nodes.includes(cands[0]))
                    nodes.push(cands[0]);
                if (!nodes.includes(cands[1]))
                    nodes.push(cands[1]);
                    
                strongPairs.push([nodes.indexOf(cands[0]), nodes.indexOf(cands[1])]);
            } 
        }
    }

    for (let i = 0; i < nodes.length; i++) {
        ufnodes.push ( {
            parent : i, 
            size : 1,
            value : nodes[i]
        });
    }

    // We then add the weak links. This is done by checking if both ends are connectible to another pair

    for (let i = 0; i < strongPairs.length; i++) {
        const x = nodes[strongPairs[i][0]];
        const y = nodes[strongPairs[i][1]];
        let xpaired : number[][]= [];
        let ypaired : number[][]= [];

        for(let j = i + 1 ; j < strongPairs.length; j++) {

            const a = nodes[strongPairs[j][0]];
            const b = nodes[strongPairs[j][1]];

            if (isNeighbors(x, a) > 0) {
                xpaired.push([strongPairs[i][0], strongPairs[j][0]]);
            }
            if (isNeighbors(x, b) > 0) {
                xpaired.push([strongPairs[i][0], strongPairs[j][1]]);
            }
            if (isNeighbors(y, a) > 0) {
                ypaired.push([strongPairs[i][1], strongPairs[j][0]]);
            }
            if (isNeighbors(y, b) > 0) {
                ypaired.push([strongPairs[i][1], strongPairs[j][1]]);
            }
        }

        if (xpaired.length > 0 && ypaired.length > 0) {
            weakPairs = weakPairs.concat(xpaired).concat(ypaired);
            cycle.strongLinks.push([x, y]);
        }
    }

    if (strongPairs.length <= 0 || weakPairs.length <= 0) {
        return {
            cells : [],
            strongLinks : [],
            weakLinks: []
        }
    }
    
    // We build the UF structure
    for (let i =0 ; i < strongPairs.length; i++){
        union<Cell>(strongPairs[i][0], strongPairs[i][1], ufnodes);
    }

    let root = weakPairs[0][0];
    for (let i = 0; i < weakPairs.length; i++) {
        union<Cell>(weakPairs[i][0], weakPairs[i][1], ufnodes);
        // Add all weakpairs
        cycle.weakLinks.push([nodes[weakPairs[i][0]], nodes[weakPairs[i][1]]]);
    }

    // We then build the x-cycle.
    for (let i = 0; i < nodes.length; i++) {
        if (find<Cell>(i, ufnodes) === root){
            cycle.cells.push(ufnodes[i].value);
        }
    }

    return cycle;
}

export function buildCycle(cells : Cell[]) : Cell[] {
    let cycle : Cell[] = [];
    console.log(cells);
    return cycle;
} 