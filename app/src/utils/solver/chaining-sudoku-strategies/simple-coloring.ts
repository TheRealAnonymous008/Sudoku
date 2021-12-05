import { link } from "fs";
import { Cell, isNeighbors } from "../../logic/Cell";
import { Deduction } from "../../logic/Deduction";
import { getRegionIntersection, getRegionDifference, getElementsWithCandidate } from "../../logic/Region";
import { TableState } from "../../logic/rulesets/TableState";
import { addToGraph, CellGraph, CellNode, color, getTableEntry, makeLink, makeNode, partition } from "./cell-graphs";

export default function simpleColoring (table :TableState, n : number) : Deduction{
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

    //                  Framed a different way:  we let R and B, be regions of cells, and
    //                      SUB-RULE 1:     If two cells in B are neighbrs, remove n from both of these cells.
    //                      SUB-RULE 2:     If a cell not in the chain intersects with the chain twice, remove n.


    // C := the list of all bivalue cells for a particular candidate.
    // NC := the list of all cells not in the chain

    let deduction : Deduction = {
        cause : [],
        effect : []
    }
    const chain : CellGraph = formChain(table, n);
    let chainUnion : Cell[] = [];
    let success = false;
    // We then eliminate candidates based on the subrules for each chain
    for (let i = 0; i < chain.nodes.length; i++) {
        chainUnion = chainUnion.concat(getTableEntry(chain.nodes[i], table));
    }
    color(chain);
    if (!success) {
        deduction.effect = deduction.effect.concat(checkOffChain(table, chain, n)); 
        success = (deduction.effect.length !== 0);
    }
    if (!success) {
        deduction.effect = deduction.effect.concat(checkOnChain(table, chain, n)); 
        success = (deduction.effect.length !== 0);
    }

    deduction.cause = chainUnion;
    deduction.effect = deduction.effect.filter((c, index) => {
        return deduction.effect.indexOf(c) === index;
    })

    return deduction;
}

export function checkOnChain(table : TableState, g : CellGraph,  n : number) : Cell[] {
    const B= partition(g, 2);
    let first : Cell[] = [];
    let second : Cell[]= [];

    for (let j = 0; j < B[0].length; j++){
        first = first.concat (getTableEntry(B[0][j], table));
    }
    for (let j = 0; j < B[1].length; j++){
        second = second.concat (getTableEntry(B[1][j], table));
    }

    let effect : Cell[] = getRegionIntersection(first, second);

    // We ensure that each entry that has two colors cannot be the candidate
    let success = false;
    effect.forEach(element => {
        if (element.candidates.includes(n))
            success = true;
        element.candidates = element.candidates.filter((value : number) => { return value !== n});
        return element;
    });

    if(success)
        return effect;
    return [];
}

export function checkOffChain(table : TableState , g : CellGraph, n : number) : Cell[] {
    // Remove all entries not in the chain and which see two colors
    const B= partition(g, 2);
    let first : Cell[] = [];
    let second : Cell[]= [];

    for (let j = 0; j < B[0].length; j++){
        first = first.concat (getTableEntry(B[0][j], table));
    }
    
    for (let j = 0; j < B[1].length; j++){
        second = second.concat (getTableEntry(B[1][j], table));
    }
    
    let effect : Cell[]= [];
    const inter : Cell[] = getRegionIntersection(first, second);
    const firstPrime = getRegionDifference(first, inter);
    const secondPrime = getRegionDifference(second, inter);


    for (let i = 0 ; i <table.cells.length; i++) {
        for (let j = 0; j < table.cells.length; j++){
            const cell = table.cells[i][j];
            if (first.includes(cell) || second.includes(cell))
                continue;

            for (let x = 0; x < firstPrime.length; x++){
                for(let y= 0 ; y < secondPrime.length; y ++) {
                    if (isNeighbors(cell, firstPrime[x]) !== 0 && isNeighbors(cell, secondPrime[y]) !== 0 && 
                    (!secondPrime.includes(firstPrime[x])) && cell.value === 0) {
                        effect.push(cell);
                        break;
                    }
                }
            }
        }
    }

    let success = false;
    effect.forEach(element => {
        if (element.candidates.includes(n))
            success = true;

        element.candidates = element.candidates.filter((value : number) => { return value !== n});

    });

    if (success)
        return effect;
    return [];
}

export function formChain (table : TableState, n : number) : CellGraph {
    let graph : CellGraph = {
        nodes : []
    } 

    for (let i = 0; i < table.regions.length; i ++) {
        const cands = getElementsWithCandidate(table.regions[i].cells, n);
        // We ensure that the selected cells intersect at exactly 1 region.
        // We also build the graph here so that the individual links in the graph are properly made.
        if (cands.length === 2) {
            if (isNeighbors(cands[0], cands[1]) === 1){
                let c = makeNode([cands[0]]);
                let d = makeNode([cands[1]]);
                addToGraph(graph, c);
                addToGraph(graph, d);
                makeLink(c, d, graph);
            } 
        }
    }

    return graph;
}

