import { Cell, getElementsWithCandidate, getRegionDifference, getRegionIntersection, intersects, isNeighbors } from "../../logic/Cell";
import { Deduction } from "../../logic/Deduction";
import { TableState } from "../../logic/rulesets/TableState";

type UnionFindNode<T> = {
    parent : number, 
    size : number,
    value : T
}

type Bipartition = {
    first : Cell[],
    second : Cell[]
}

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

    const L : Set<Cell> = new Set<Cell>();
    const M : Set<Cell> = new Set<Cell>();

    for (let i = 0; i < table.regions.length; i ++) {
        const cands = getElementsWithCandidate(table.regions[i], n);
        // We ensure that the selected cells intersect at exactly 1 region.
        if (cands.length === 2) {
            if (isNeighbors(cands[0], cands[1]) === 1){
                L.add(cands[0]);
                L.add(cands[1]);
            } 
        }
    }

    table.cells.flat().forEach(cell => {
        if (! L.has(cell)) {
            M.add(cell);
        }
    });

    // We begin to build the chain.
    let ltemp : Cell[] = []

    const iter = L.values();
    for (let i = 0; i < L.size; i++) {
        ltemp.push(iter.next().value);
    }
    const chains :Cell[][] = formAllChains(ltemp);
    let chainUnion : Cell[] = [];
    let success = false;
    // We then eliminate candidates based on the subrules for each chain
    for (let i = 0; i < chains.length; i++) {
        const b  = bipartition(chains[i]);
        chainUnion = chainUnion.concat(chainUnion, chains[i]);
        if (!success) {
            deduction.effect = deduction.effect.concat(checkOffChain(table, b, n)); 
            success = (deduction.effect.length !== 0);
        }
        if (!success) {
            deduction.effect = deduction.effect.concat(checkOnChain(table, b, n)); 
            success = (deduction.effect.length !== 0);
        }
    }

    deduction.cause = chainUnion;

    return deduction;
}

export function checkOnChain(table : TableState, b : Bipartition, n : number) : Cell[] {
    let effect : Cell[] = getRegionIntersection(b.first, b.second);

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

export function checkOffChain(table : TableState , b : Bipartition, n : number) : Cell[] {
    // Remove all entries not in the chain and which see two colors
    let effect : Cell[]= [];
    const inter : Cell[] = getRegionIntersection(b.first, b.second);
    const firstPrime = getRegionDifference(b.first, inter);
    const secondPrime = getRegionDifference(b.second, inter);


    for (let i = 0 ; i <table.cells.length; i++) {
        for (let j = 0; j < table.cells.length; j++){
            const cell = table.cells[i][j];
            if (b.first.includes(cell) || b.second.includes(cell))
                continue;

            for (let x = 0; x < firstPrime.length; x++){
                for(let y= 0 ; y < secondPrime.length; y ++) {
                    if (isNeighbors(cell, firstPrime[x]) !== 0 && isNeighbors(cell, secondPrime[y]) !== 0 && 
                    (isNeighbors(secondPrime[y], firstPrime[x]) === 0)) {
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

export function bipartition(cells : Cell[]) : Bipartition{
    const B : Bipartition = {
        first : [],
        second : []
    }

    B.first.push(cells[0]);

    const queue = [];
    queue.push(0);

    while (queue.length > 0) {
        let c = queue[0];
        queue.shift();

        for (let v = 0; v < cells.length; v++){
            if (isNeighbors(cells[v], cells[c]) !== 0) {
                if (!B.first.includes(cells[v]) && !B.second.includes(cells[v]) && !queue.includes(v)) {
                    queue.push(v);
                }
                if (B.first.includes(cells[c]) && !B.second.includes(cells[c]) && !B.second.includes(cells[v])) {
                    B.second.push(cells[v]);
                }
                else if (B.second.includes(cells[c]) && !B.first.includes(cells[c]) && !B.first.includes(cells[v])){
                    B.first.push(cells[v]);
                }
            }
        }
    }

    return B;
}

export function formAllChains (ltemp : Cell[]) : Cell[][] {
    const chains :Cell[][] = [];
    // ALGORITHM   :       Perform Union-Find on the set of cells. This produces a list of disjoint sets
    //                     Which can then be traversed and colored via BFS
    let ufnodes : UnionFindNode<Cell>[] = [] ;

    for (let i = 0; i < ltemp.length; i++) {
        ufnodes.push ( {
            parent : i, 
            size : 1,
            value : ltemp[i]
        });
    }

    
    // We union each entry in the graph.
    for (let i = 0; i < ltemp.length; i++) {
        for (let j = i; j < ltemp.length; j++) {
            if (isNeighbors(ltemp[i], ltemp[j]) !== 0)
                union<Cell>(i, j, ufnodes);
        }
    }


    // We then build each chain as a collection of subgraphs.
    // First we add all the root nodes
    for (let i = 0; i < ufnodes.length; i++) {
        if (ufnodes[i].parent === i){
            chains.push([ufnodes[i].value]);
        }
    }

    // We then connect each entry to the corresponding chain
    for (let i = 0; i < ufnodes.length; i++) {
        if (ufnodes[i].parent !== i) {
            for (let j = 0; j < chains.length; j ++) {
                let c : Cell = ufnodes[find(i, ufnodes)].value;
                if (c  === chains[j][0]) {
                    chains[j].push(ufnodes[i].value)
                    break;
                }
            }
        }
    }

    return chains;
}

function find<T>(index : number, ufnodes : UnionFindNode<T>[]) : number {
    if (ufnodes[index].parent !== index) {
        ufnodes[index].parent = find<T>(ufnodes[index].parent, ufnodes);
        return ufnodes[index].parent;
    }
    return index;
};

function union<T>(x : number, y : number, ufnodes : UnionFindNode<T>[]) {
    x = find<T>(x, ufnodes);
    y = find<T>(y, ufnodes);

    if (x === y) {
        return;
    }

    if (ufnodes[x].size < ufnodes[y].size) {
        const temp = x;
        x = y;
        y = temp;
    }

    ufnodes[y].parent = x;
    ufnodes[x].size += ufnodes[y].size
}

